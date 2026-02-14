import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class CompanyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!user.tenantId) {
      throw new ForbiddenException('Company access required');
    }

    if (user.role !== 'organisation') {
      throw new ForbiddenException('Only organisation users allowed');
    }

    return true;
  }
}
