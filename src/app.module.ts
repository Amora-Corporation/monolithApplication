import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfilModule } from './Profil/profil.module';
import { AuthModule } from './auth/auth.module';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { APP_FILTER } from '@nestjs/core';
// import { EventModule } from './event/event.module';
import { MatchingModule } from './Matching/matching.module';
// import { NotificationModule } from '../../backerecuperation/Notification/notification.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';

import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

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
        auth: {
          username: configService.get<string>('MONGODB_USER'),
          password: configService.get<string>('MONGODB_PASSWORD'),
        },
        authSource: configService.get<string>('MONGODB_AUTH_SOURCE') || 'admin',
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth:{
            user: configService.get<string>('MAILER_USER'),  // Ton adresse Gmail
            pass: configService.get<string>('MAILER_PASSWORD'), // Ton mot de passe d'application
          },

          // host: configService.get<string>('MAILER_HOST'),
          // port: configService.get<number>('MAILER_PORT'),
          // secure: false,
          // ignoreTLS: true,
        },
        defaults: {
          from: configService.get<string>('MAILER_FROM'),
        },
        template: {
          dir: join(__dirname, '/mail'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }), 
    AuthModule,
    ProfilModule,
   
    
    // EventModule,
    MatchingModule,
    // NotificationModule,
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
