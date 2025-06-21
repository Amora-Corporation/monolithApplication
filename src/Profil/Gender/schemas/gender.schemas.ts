import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

export type GenderDocument = Gender & Document;

@Schema()
export class Gender {
  // @Prop({ type: Types.ObjectId, auto: true })
  // _id: string;
  
  @Prop({ required: true, unique: true, trim: true })
  name: string;
}

export const GenderSchema = SchemaFactory.createForClass(Gender);
