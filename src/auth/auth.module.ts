import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { Auth, AuthSchema } from "./schemas/auth.schema";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { JwtModule } from "@nestjs/jwt";
import { AccessTokenStrategy } from "./strategies/accessToken.strategy";
import { RefreshTokenStrategy } from "./strategies/refreshToken.strategy";

@Module({
  imports:[
    JwtModule.register({}),
    ClientsModule.register([
      {
        name: "TOKEN_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://localhost:5672"],
          queue: "userQueue",
          queueOptions: {
            durable: false
          }
        }
      }
    ]),
    MongooseModule.forFeature([
      {name:Auth.name,schema:AuthSchema}
    ])
  ],
  controllers: [AuthController],
  providers: [AuthService,AccessTokenStrategy,RefreshTokenStrategy],
})
export class AuthModule {}
