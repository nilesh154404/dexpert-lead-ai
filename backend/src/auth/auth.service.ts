import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserStatus } from '../entities/user.entity';
import { Tenant } from '../entities/tenant.entity';
import { Role } from '../entities/role.entity';
import { Permission, PermissionModule, PermissionAction } from '../entities/permission.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ExchangeDto, ClientType } from './dto/exchange.dto';
import { ExchangeResponseDto } from './dto/exchange-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
      tenantId: registerDto.tenantId || 'default',
    });

    const savedUser = await this.userRepository.save(user);
    const { password, ...result } = savedUser;

    return {
      ...result,
      access_token: this.jwtService.sign({ sub: savedUser.id, email: savedUser.email }),
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      relations: ['tenant'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account is not active');
    }

    // Update last active
    user.lastActiveAt = new Date();
    await this.userRepository.save(user);

    const { password, ...result } = user;

    return {
      ...result,
      access_token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      }),
    };
  }

  async validateUser(userId: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['tenant', 'roleEntity', 'roleEntity.permissions'],
    });

    if (!user) {
      return null;
    }

    const { password, ...result } = user;
    return result as User;
  }

  /**
   * System/Integration Authentication
   * Exchange tenantId + tenantSecret for JWT token
   */
  async exchange(exchangeDto: ExchangeDto): Promise<ExchangeResponseDto> {
    const tenant = await this.tenantRepository
      .createQueryBuilder('tenant')
      .addSelect('tenant.tenantSecret')
      .where('tenant.id = :tenantId', { tenantId: exchangeDto.tenantId })
      .getOne();

    if (!tenant) {
      throw new UnauthorizedException('Invalid tenant credentials');
    }

    if (!tenant.tenantSecret) {
      throw new BadRequestException('Tenant secret not configured');
    }

    // Compare tenant secret (plain text comparison for API keys)
    if (tenant.tenantSecret !== exchangeDto.tenantSecret) {
      throw new UnauthorizedException('Invalid tenant credentials');
    }

    // Generate JWT with scopes based on client type
    const scopes = this.getScopesForClientType(exchangeDto.clientType);
    const expiresIn = this.getExpiresInForClientType(exchangeDto.clientType);

    const payload = {
      sub: `tenant:${tenant.id}`,
      tenantId: tenant.id,
      type: 'system',
      clientType: exchangeDto.clientType,
      scopes,
    };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: `${expiresIn}m`,
    });

    return {
      access_token,
      expires_in: expiresIn * 60, // Convert to seconds
      token_type: 'Bearer',
      scopes,
      tenantId: tenant.id,
    };
  }

  private getScopesForClientType(clientType: ClientType): string[] {
    switch (clientType) {
      case ClientType.API:
        return ['leads:create', 'leads:read', 'conversations:read', 'conversations:write'];
      case ClientType.WEB:
      case ClientType.MOBILE:
        return ['*']; // Full access for web/mobile clients
      default:
        return [];
    }
  }

  private getExpiresInForClientType(clientType: ClientType): number {
    switch (clientType) {
      case ClientType.API:
        return 60; // 60 minutes for API
      case ClientType.WEB:
        return 60; // 60 minutes for web
      case ClientType.MOBILE:
        return 15; // 15 minutes for mobile
      default:
        return 15;
    }
  }

  /**
   * Get user permissions (from role or direct permissions)
   */
  async getUserPermissions(userId: string): Promise<Permission[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roleEntity', 'roleEntity.permissions'],
    });

    if (!user || !user.roleEntity) {
      return [];
    }

    return user.roleEntity.permissions || [];
  }

  /**
   * Check if user has a specific permission
   */
  async hasPermission(
    userId: string,
    module: PermissionModule,
    action: PermissionAction,
  ): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roleEntity', 'roleEntity.permissions'],
    });

    if (!user) {
      return false;
    }

    // SuperAdmin has all permissions
    if (user.role === 'super_admin') {
      return true;
    }

    if (!user.roleEntity || !user.roleEntity.permissions) {
      return false;
    }

    return user.roleEntity.permissions.some(
      (permission) => permission.module === module && permission.action === action,
    );
  }
}
