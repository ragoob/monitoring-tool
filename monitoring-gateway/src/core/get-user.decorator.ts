import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "../authentication/models/user.entity";

export const GetUser = createParamDecorator((data, executionContext: ExecutionContext): User => {
    const req = executionContext.switchToHttp().getRequest();
    return req.user;
})