import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../User/schemas/user.schema';

export type PhotoDocument = Photo & Document;

@Schema({ timestamps: true })
export class Photo {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ required: true })
  link: string;

  @Prop({ required: true })
  details: string;

  @Prop({ default: Date.now })
  dateAdding: Date;
}

export const PhotoSchema = SchemaFactory.createForClass(Photo);
