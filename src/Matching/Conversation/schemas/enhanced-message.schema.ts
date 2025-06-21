import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Conversation } from './conversation.schema';
import { User } from '../../../Profil/User/schemas/user.schema';

export interface ReadReceipt {
  userId: Types.ObjectId;
  readAt: Date;
}

export type EnhancedMessageDocument = EnhancedMessage & Document;

@Schema({ timestamps: true })
export class EnhancedMessage {
  @Prop({ type: Types.ObjectId, ref: 'Conversation', required: true })
  conversationId: Conversation;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  senderId: User;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: [{ userId: { type: Types.ObjectId, ref: 'User' }, readAt: { type: Date } }], default: [] })
  readBy: ReadReceipt[];

  @Prop({ type: Boolean, default: false })
  isEdited: boolean;

  @Prop({ type: Date })
  editedAt: Date;

  @Prop({ type: String, enum: ['text', 'image', 'video', 'audio', 'file', 'location'], default: 'text' })
  messageType: string;

  @Prop({ type: Object, default: {} })
  mediaInfo: {
    url?: string;
    thumbnailUrl?: string;
    mimeType?: string;
    fileName?: string;
    fileSize?: number;
    duration?: number;
    width?: number;
    height?: number;
    latitude?: number;
    longitude?: number;
  };

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const EnhancedMessageSchema = SchemaFactory.createForClass(EnhancedMessage); 