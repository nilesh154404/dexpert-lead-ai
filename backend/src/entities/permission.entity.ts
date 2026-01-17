import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';

export enum PermissionModule {
  STAFF = 'staff',
  LEADS = 'leads',
  APPOINTMENTS = 'appointments',
  ROLES = 'roles',
  TENANTS = 'tenants',
  ANALYTICS = 'analytics',
  CONVERSATIONS = 'conversations',
  AI_CONFIG = 'ai_config',
  BRANDING = 'branding',
}

export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage', // Full CRUD + admin actions
}

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ name: 'module', type: 'enum', enum: PermissionModule })
  module: PermissionModule;

  @Column({ name: 'action', type: 'enum', enum: PermissionAction })
  action: PermissionAction;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
