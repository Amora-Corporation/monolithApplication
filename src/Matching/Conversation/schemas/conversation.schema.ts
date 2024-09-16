import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from "../../../Profil/User/schemas/user.schema";

export type ConversationDocument = Conversation & Document;

@Schema({ timestamps: true })
export class Conversation {

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: true })
  participants_ID: User[];

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
