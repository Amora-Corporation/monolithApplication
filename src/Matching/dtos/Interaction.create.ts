import { IsDate, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { ApiProperty } from '@nestjs/swagger';

export class CreateInteractionDto {

  @ApiProperty({
    description: 'The ID of the user who is sending the interaction',
    example: '60d0fe4f5311236168a109ca',
    type: Types.ObjectId,  // Swagger ne comprend pas Types.ObjectId, donc il faut utiliser String
  })
  @IsNotEmpty()
  @IsMongoId()
  sender_user_ID: Types.ObjectId;

  @ApiProperty({
    description: 'The ID of the user who is receiving the interaction',
    example: '60d0fe4f5311236168a109cb',
    type: Types.ObjectId,
  })
  @IsNotEmpty()
  @IsMongoId()
  receiver_user_ID: Types.ObjectId;

}

