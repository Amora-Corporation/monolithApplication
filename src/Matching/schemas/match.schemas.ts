import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { User } from "../../Profil/schemas/profil.schema";

export type MatchDocument = Match & Document;

@Schema({ timestamps: true })
export class Match{
  @Prop({ type: Types.ObjectId, ref:'User', required: true })
  userId1: User;

  @Prop({ type: Types.ObjectId, ref:'User', required: true })
  userId2: User;

  @Prop({ default: Date.now })
  matchDate: Date;

  @Prop({ type: Boolean, required: true, default: true })
  isActive: Boolean;
}

export const MatchSchema = SchemaFactory.createForClass(Match);