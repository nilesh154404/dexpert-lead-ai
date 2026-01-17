import { SetMetadata } from '@nestjs/common';
import { PermissionModule, PermissionAction } from '../../entities/permission.entity';

export const PERMISSIONS_KEY = 'permissions';

export interface PermissionRequirement {
  module: PermissionModule;
  action: PermissionAction;
}

export const RequirePermissions = (...permissions: PermissionRequirement[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
