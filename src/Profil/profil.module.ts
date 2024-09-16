import { Module } from '@nestjs/common';
import { UserModule } from "./User/user.module";
import { PhotoModule } from "./Photo/photo.module";
import { GenderModule } from "./Gender/gender.module";

@Module({
  imports: [
    UserModule,
    PhotoModule,
    GenderModule,
  ],
})
export class ProfilModule {}
