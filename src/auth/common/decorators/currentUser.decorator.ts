import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      console.log("Aucun utilisateur trouvé dans la requête");
      return null;
    }
    // console.log("Utilisateur trouvé dans la requête:", request.user);
    return request.user;
  },
);
