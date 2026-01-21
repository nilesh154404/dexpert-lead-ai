import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY, PermissionRequirement } from '../decorators/permissions.decorator';
import { AuthService } from '../auth.service';
import { PermissionModule, PermissionAction } from '../../entities/permission.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
  const requiredPermissions = this.reflector.getAllAndOverride<PermissionRequirement[]>(
    PERMISSIONS_KEY,
    [context.getHandler(), context.getClass()],
  );

  // If no permissions are required, allow
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }

  const request = context.switchToHttp().getRequest();
  const user = request.user;

  if (!user) {
    throw new ForbiddenException('Authentication required');
  }

  // ✅ IMPORTANT FIX: Super Admin bypasses ALL permission checks
  if (user.role === 'super_admin') {
    return true;
  }

  // System tokens (exchange endpoint)
  if (user.type === 'system') {
    const scopes = user.scopes || [];
    return requiredPermissions.every((req) => {
      const scopeName = `${req.module}:${req.action}`;
      return scopes.includes('*') || scopes.includes(scopeName);
    });
  }

  if (!user.id) {
    throw new ForbiddenException('Invalid user context');
  }

  // Check permissions from roleEntity
  for (const permission of requiredPermissions) {
    const hasPermission = await this.authService.hasPermission(
      user.id,
      permission.module,
      permission.action,
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `Missing permission: ${permission.module}:${permission.action}`,
      );
    }
  }

  return true;
}

}
