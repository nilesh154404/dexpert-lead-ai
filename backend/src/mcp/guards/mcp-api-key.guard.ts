import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class MCPApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('x-api-key header missing');
    }

    if (apiKey !== process.env.MCP_API_KEY) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}