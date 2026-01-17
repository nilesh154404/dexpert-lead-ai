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

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No permissions required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    // System tokens (from exchange endpoint) don't need permission checks
    // They are validated by scopes
    if (user.type === 'system') {
      // For system tokens, check scopes instead
      const scopes = user.scopes || [];
      const hasAllPermissions = requiredPermissions.every((req) => {
        // Check if scope matches (e.g., 'leads:create' matches PermissionModule.LEADS + PermissionAction.CREATE)
        const scopeName = `${req.module}:${req.action}`;
        return scopes.includes('*') || scopes.includes(scopeName);
      });
      return hasAllPermissions;
    }

    // User-based tokens - check permissions
    if (!user.id) {
      throw new ForbiddenException('Invalid user context');
    }

    // SuperAdmin has all permissions
    if (user.role === 'super_admin') {
      return true;
    }

    // Check each required permission
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
