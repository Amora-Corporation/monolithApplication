import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AuthDocument = Auth & Document;

@Schema({ timestamps: true })
export class Auth {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], default: ['User'] })
  roles: string[];

  @Prop({ type: Boolean, default: false })
  isBlocked: boolean;

  @Prop({ type: Date, default: null })
  lastLogin: Date;

  @Prop({ type: Boolean, default: false })
  isEmailVerified: boolean;
  
  @Prop({ type: Number, default: 0 })
  loginAttempts: number;

  @Prop({ type: Date, default: null })
  lockUntil: Date;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
