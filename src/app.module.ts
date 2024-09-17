import { Module } from '@nestjs/common';
import { UserModule } from "./Profil/User/user.module";
import { PhotoModule } from "./Profil/Photo/photo.module";
import { GenderModule } from "./Profil/Gender/gender.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ProfilModule } from "./Profil/profil.module";
import { Auth } from "./auth/schemas/auth.schema";
import { AuthModule } from "./auth/auth.module";
import { SentryGlobalFilter, SentryModule } from "@sentry/nestjs/setup";
import { APP_FILTER } from "@nestjs/core";
import { EventModule } from './event/event.module';

@Module({
  imports: [
    SentryModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        dbName: 'Amora-Monolith',
      }),
      inject: [ConfigService],
    }),
    ProfilModule,
    AuthModule,
    EventModule
  ],
  providers: [{
    provide: APP_FILTER,
    useClass: SentryGlobalFilter,
  }]
})
export class AppModule {}
