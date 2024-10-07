import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Gender, GenderSchema } from "./schemas/gender.schemas";
import { GenderService } from "./gender.service";
import { GenderController } from "./gender.controller";
import { JwtModule } from "@nestjs/jwt";


@Module(
  {
    imports:[
      JwtModule.register({}),
      MongooseModule.forFeature([
        {name: Gender.name, schema: GenderSchema},
      ])
    ],

    providers:[GenderService],
    controllers:[GenderController]
  }
)
export class GenderModule {

}