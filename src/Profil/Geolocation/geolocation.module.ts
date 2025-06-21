import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GeolocationController } from './geolocation.controller';
import { GeolocationService } from './geolocation.service';
import { Geolocation, GeolocationSchema } from './schemas/geolocation.schema';
import { User, UserSchema } from '../User/schemas/user.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Geolocation.name, schema: GeolocationSchema },
      { name: User.name, schema: UserSchema },
    
    ]),
  ],
  controllers: [GeolocationController],
  providers: [GeolocationService,JwtService],
  exports: [GeolocationService],
})
export class GeolocationModule {} 