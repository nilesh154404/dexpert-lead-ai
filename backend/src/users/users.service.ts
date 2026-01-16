import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto, tenantId: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      tenantId,
    });

    const savedUser = await this.userRepository.save(user);
    const { password, ...result } = savedUser;
    return result as User;
  }

  async findAll(tenantId: string): Promise<User[]> {
    const users = await this.userRepository.find({
      where: { tenantId },
      relations: ['tenant'],
      order: { createdAt: 'DESC' },
    });

    return users.map((user) => {
      const { password, ...result } = user;
      return result as User;
    });
  }

  async findOne(id: string, tenantId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, tenantId },
      relations: ['tenant', 'assignedLeads'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { password, ...result } = user;
    return result as User;
  }

  async update(id: string, updateUserDto: UpdateUserDto, tenantId: string): Promise<User> {
    const user = await this.findOne(id, tenantId);
    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);
    const { password, ...result } = updatedUser;
    return result as User;
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const user = await this.findOne(id, tenantId);
    await this.userRepository.remove(user);
  }
}
