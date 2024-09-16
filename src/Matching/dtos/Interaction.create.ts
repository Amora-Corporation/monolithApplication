import { IsDate, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

import { Types } from "mongoose";


export class CreateInteractionDto {
  @IsNotEmpty()
  @IsMongoId()
  sender_user_ID: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  receiver_user_ID: Types.ObjectId;

}