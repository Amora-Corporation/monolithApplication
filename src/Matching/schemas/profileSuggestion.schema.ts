import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../Profil/User/schemas/user.schema';

export type ProfileSuggestionDocument = ProfileSuggestion & Document;

@Schema({ timestamps: true })
export class ProfileSuggestion {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  suggestedUserId: User;
  
  @Prop({ type: Number, required: true })
  compatibilityScore: number;

  @Prop({ type: [String] })
  matchingInterests: string[];

  @Prop({ type: Number })
  distance: number;

  @Prop({ type: Boolean, default: false })
  isViewed: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ProfileSuggestionSchema = SchemaFactory.createForClass(ProfileSuggestion); 