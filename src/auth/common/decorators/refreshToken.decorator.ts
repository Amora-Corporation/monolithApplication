// refresh-token.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_REFRESH_TOKEN_ROUTE = 'isRefreshTokenRoute';
export const RefreshTokenRoute = () => SetMetadata(IS_REFRESH_TOKEN_ROUTE, true);
