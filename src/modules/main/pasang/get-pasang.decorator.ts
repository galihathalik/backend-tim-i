import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetPasang = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.pasang;
  },
);
