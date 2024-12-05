import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateInteractionDto {
  @ApiProperty({
    description: 'The ID of the user who is sending the interaction',
    example: '60d0fe4f5311236168a109ca',
    type: String, // Swagger ne comprend pas Types.ObjectId, donc il faut utiliser String
  })
  @IsNotEmpty()
  @IsMongoId()
  sender_user_ID: string;

  @ApiProperty({
    description: 'The ID of the user who is receiving the interaction',
    example: '60d0fe4f5311236168a109cb',
    type: String,
  })
  @IsNotEmpty()
  @IsMongoId()
  receiver_user_ID: string;
}
