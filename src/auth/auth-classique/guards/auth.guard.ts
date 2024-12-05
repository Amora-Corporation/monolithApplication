import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';
import { IS_ADMIN_KEY } from '../../common/decorators/isAdmin.decorator';
import { Request } from 'express';
import { IS_REFRESH_TOKEN_ROUTE } from 'src/auth/common/decorators/refreshToken.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const isRefreshTokenRoute = this.reflector.getAllAndOverride<boolean>(
      IS_REFRESH_TOKEN_ROUTE,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      let payload;
      if (isRefreshTokenRoute) {
        payload = this.jwtService.decode(token);
      } else {
        payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET_KEY,
        });
      }
      if (
        !payload ||
        typeof payload !== 'object' ||
        !Array.isArray(payload.roles)
      ) {
        throw new UnauthorizedException('Invalid token payload');
      }

      request['auth'] = payload;

      const isAdmin = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (isAdmin && !payload.roles.includes('admin')) {
        throw new UnauthorizedException('Admin access required');
      }
    } catch (error) {
      if (isRefreshTokenRoute && error.name === 'JsonWebTokenError') {
        return true;
      }
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
