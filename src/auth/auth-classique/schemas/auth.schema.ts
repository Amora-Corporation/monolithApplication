import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type AuthDocument = Auth & Document;

@Schema()
export class Auth {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], default: ["admin"] })
  roles: string[];
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
