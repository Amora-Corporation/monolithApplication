import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class UpdateMessageDTO {
  @IsMongoId()
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  conversation_Id: Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  sender_Id: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  content: string;
}
