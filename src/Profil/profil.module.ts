import { Module } from '@nestjs/common';
import { UserModule } from './User/user.module';
import { PhotoModule } from './Photo/photo.module';
import { GenderModule } from './Gender/gender.module';
import { GeolocationModule } from './Geolocation/geolocation.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({}), UserModule, PhotoModule, GenderModule, GeolocationModule],
})
export class ProfilModule {}
