import { IsArray, IsNotEmpty, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class CreateConversationDto {
  @IsArray()
  @ArrayMinSize(2, {
    message: 'A conversation must have at least 2 participants',
  })
  @IsNotEmpty({ each: true })
  @Type(() => Types.ObjectId)
  participants_ID: Types.ObjectId[];
}
