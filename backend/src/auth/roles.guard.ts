import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES } from "src/decorators/roles.decorator";
import { Role } from "src/enums/role.enum";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES, [
            context.getHandler(),
            context.getClass()
        ]);
        if (!requiredRoles) {
            return true
        }
        const { user } = context.switchToHttp().getRequest()

        return requiredRoles.some((requiredRole) => user.role == requiredRole)
    }
}