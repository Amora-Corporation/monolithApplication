import { Module } from '@nestjs/common';
import { AuthService } from './auth-classique/services/auth.service';
import { AuthController } from './auth-classique/auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from './auth-classique/schemas/auth.schema';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './auth-classique/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './auth-classique/strategies/refreshToken.strategy';
import { UserModule } from '../Profil/User/user.module';
import { User, UserSchema } from '../Profil/User/schemas/user.schema';
import { GoogleStrategy } from './auth-classique/strategies/google-Oauth.strategy';
import { PassportModule } from '@nestjs/passport';
import { MailService } from './auth-classique/services/mail.service';
import { AuthsocialMediaController } from './authsocial-media/authsocial-media.controller';
import { AuthsocialMediaService } from './authsocial-media/services/authsocial-media.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'google' }),
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: Auth.name, schema: AuthSchema },
      { name: User.name, schema: UserSchema },
    ]),

    UserModule,
  ],
  controllers: [AuthController, AuthsocialMediaController],
  providers: [
    AuthsocialMediaService,
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    GoogleStrategy,
    MailService,
  ],
})
export class AuthModule {}
