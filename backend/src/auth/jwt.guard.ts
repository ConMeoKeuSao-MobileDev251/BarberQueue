import { ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { IS_PUBLIC_KEY } from "src/decorators/public.decorator";
import { tokenBlacklist } from "./blacklist.store";

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
    private readonly logger = new Logger('JwtGuard');

    constructor(private readonly reflector: Reflector) {
        super()
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        if(isPublic){
            return true
        }

        const request = context.switchToHttp().getRequest();
        const token = request.headers['authorization']?.split(' ')[1];

        if (tokenBlacklist.has(token)) {
            throw new UnauthorizedException('Token has been revoked');
        }

        return super.canActivate(context)
    }
}