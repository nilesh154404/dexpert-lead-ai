import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../entities/user.entity';

export const CurrentTenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest();
    const user: User = request.user;
    
    // SUPER_ADMIN doesn't have a tenant, return null (allows access to all)
    if (user?.role === 'super_admin') {
      return null;
    }
    
    return user?.tenantId || null;
  },
);
