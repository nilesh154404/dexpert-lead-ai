import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'your-secret-key'),
    });
  }

  async validate(payload: any) {
    // Handle system tokens (from exchange endpoint)
    if (payload.type === 'system') {
      return {
        id: payload.sub,
        tenantId: payload.tenantId,
        type: 'system',
        clientType: payload.clientType,
        scopes: payload.scopes || [],
      };
    }

    // Handle user tokens
    const user = await this.authService.validateUser(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }

    // Attach permissions to user object
    const permissions = await this.authService.getUserPermissions(user.id);
    
    return {
      ...user,
      permissions: permissions.map((p) => `${p.module}:${p.action}`),
    };
  }
}
