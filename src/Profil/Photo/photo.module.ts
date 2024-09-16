import { Module } from "@nestjs/common";
import { PhotoController } from "./photo.controller";
import { PhotoService } from "./photo.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Photo, PhotoSchema } from "./schemas/photo.schema";


@Module({
  imports:[
    MongooseModule.forFeature([
      { name: Photo.name, schema: PhotoSchema }
    ])
  ],
  controllers: [PhotoController],
  providers:[PhotoService]
})
export class PhotoModule {}
