import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Auth, AuthSchema } from "./schemas/auth.schema";
import { JwtModule } from "@nestjs/jwt";
import { AccessTokenStrategy } from "./strategies/accessToken.strategy";
import { RefreshTokenStrategy } from "./strategies/refreshToken.strategy";
import { UserModule } from "../Profil/User/user.module";
import { User, UserSchema } from "../Profil/User/schemas/user.schema";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "./guards/roles.guard";


@Module({
  imports: [

    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: Auth.name, schema: AuthSchema },
      { name: User.name, schema: UserSchema }
    ]),

    UserModule
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy,
  ]
})
export class AuthModule {
}
