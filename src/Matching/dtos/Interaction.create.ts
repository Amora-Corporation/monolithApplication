import { IsMongoId, IsNotEmpty, IsEnum } from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum InteractionType {
  LIKE = 'like',
  NOPE = 'nope',
}

export class CreateInteractionDto {
  @ApiProperty({
    description: 'The ID of the user who is receiving the interaction',
    example: '60d0fe4f5311236168a109cb',
    type: Types.ObjectId,
  })
  @IsNotEmpty()
  @IsMongoId()
  receiver_user_ID: Types.ObjectId;

  @ApiProperty({
    description: 'The type of interaction',
    example: InteractionType.LIKE,
    enum: InteractionType, // Utiliser 'enum' au lieu de 'type' pour Swagger
  })
  @IsNotEmpty()
  @IsEnum(InteractionType)
  likeType: InteractionType;
}
