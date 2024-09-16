import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { User } from "../../Profil/User/schemas/user.schema";

export type InteractionDocument = Interaction & Document;

@Schema({ timestamps: true })
export class Interaction{
  @Prop({ type: Types.ObjectId, ref:'User', required: true })
  sender_user_ID: User;

  @Prop({ type: Types.ObjectId, ref:'User', required: true })
  receiver_user_ID: User;

  @Prop({ type: String, enum: ['like','dislike'], required: true })
  likeType: string;

  @Prop({ default: Date.now })
  date_sent: Date;
}

export const InteractionSchema = SchemaFactory.createForClass(Interaction);