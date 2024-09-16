import { Module } from '@nestjs/common';
import { ProfilController } from './user.controller';
import { ProfilService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './User/schemas/user.schema';
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
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
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [ProfilController],
  providers: [ProfilService],
})
export class ProfilModule {}
