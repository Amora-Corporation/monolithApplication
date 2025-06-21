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
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
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
   
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    // console.log("Token extrait:", token ? "Présent" : "Absent");
    
    if (!token) {
      throw new UnauthorizedException('Token non fourni dans l\'en-tête Authorization');
    }

    if (!process.env.JWT_SECRET_KEY) {
      // console.error("JWT_SECRET_KEY n'est pas défini dans les variables d'environnement");
      throw new UnauthorizedException('Configuration du serveur invalide');
    }

    let userPayload: any;
    try {
      if (isRefreshTokenRoute) {
        // console.log("Route de refresh token détectée, décodage du token sans vérification");
        userPayload = this.jwtService.decode(token);
      } else {
        // console.log("Vérification du token avec JWT_SECRET_KEY");
        userPayload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET_KEY,
        });
      }
      
      // console.log("Payload du token:", JSON.stringify(userPayload, null, 2));

      if (!userPayload) {
        throw new UnauthorizedException('Token vide ou invalide');
      }

      if (typeof userPayload !== 'object') {
        throw new UnauthorizedException('Format du token invalide');
      }

      if (!Array.isArray(userPayload.roles)) {
        throw new UnauthorizedException('Roles manquants dans le token');
      }

      request['user'] = userPayload;

      const isAdmin = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (isAdmin && !userPayload.roles.includes('Admin')) {

        throw new UnauthorizedException('Admin access required');
      }
    } catch (error) {
      // console.error("Erreur lors de la vérification du token:", error.message);
      if (isRefreshTokenRoute && error.name === 'JsonWebTokenError') {
        // console.log("Route de refresh token - autorisation accordée malgré l'erreur JWT");
        return true;
      }
      throw new UnauthorizedException(`Token invalide: ${error.message}`);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    // console.log("En-tête Authorization complet:", authHeader);

    if (!authHeader) {
      // console.log("Pas d'en-tête Authorization trouvé");
      return undefined;
    }

    const [type, token] = authHeader.split(' ');
    // console.log("Type d'authentification:", type);
    // console.log("Token brut:", token ? "Présent" : "Absent");

    if (type !== 'Bearer' || !token) {
      // console.log("Format d'authentification invalide - doit être 'Bearer <token>'");
      return undefined;
    }

    return token;
  }
}
