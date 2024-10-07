import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class GoogleOAuth2Guard extends AuthGuard('google') {
    
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);
    
    // Vous pouvez ajouter une logique ici si nécessaire
    return !!canActivate; // Convertit la valeur en boolean
  }
  
  handleRequest(err: any, user: any, info: any): any {
    if (err || !user) {
      throw err || new UnauthorizedException('User not authenticated'); // Message d'erreur plus explicite
    }
    return user;
  }
}
