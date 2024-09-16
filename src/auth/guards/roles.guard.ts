import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role, ROLES_KEY } from "../decorators/roles.decorator";


@Injectable()
export class RolesGuard implements CanActivate{
  constructor(private reflector: Reflector ){}
  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY,[
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredRoles) return true;
    const {auth} = context.switchToHttp().getRequest();
    return requiredRoles.some((role)=>auth.roles.includes(role));
  }
}