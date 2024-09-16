import { Document, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { MessageService } from "../message.service";
import { Conversation } from "./conversation.schema";
import { User } from "../../Profil/schemas/profil.schema";

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId,ref:'Conversation', required: true })
  conversation_Id: Conversation;

  @Prop({ type: Types.ObjectId, ref:'User', required: true })
  sender_Id: User;

  @Prop({type : String , required: true })
  content: string

  @Prop({ default: Date.now })
  timestamp: Date;
}
export const MessageSchema = SchemaFactory.createForClass(Message)