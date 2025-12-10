import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
    (context: ExecutionContext) => {
        return context.switchToHttp().getRequest().user
    }
)