import { Document, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "../../Profil/User/schemas/user.schema";
import { Gender } from "../../Profil/Gender/schemas/gender.schemas";

export type MatchPreferenceDocument = MatchPreference & Document;

@Schema({ timestamps: true })
export class MatchPreference {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Gender' }], required: true })
  genderPreference: Gender[];

  @Prop({ type: { min: Number, max: Number }, required: true })
  ageRange: { min: number; max: number };

  @Prop({ type: { min: Number, max: Number }, required: true })
  distanceRange: { min: number; max: number };

  @Prop({ type: { min: Number, max: Number }, required: true })
  heightRange: { min: number; max: number };

  @Prop({ type: [String] })
  bodyTypePreference: string[];

  @Prop({ type: [String] })
  educationLevelPreference: string[];

  @Prop({ type: [String] })
  relationshipStatusPreference: string[];

  @Prop({ type: String })
  smokingPreference: string;

  @Prop({ type: String })
  drinkingPreference: string;

  @Prop({ type: String })
  childrenPreference: string;

  @Prop({ type: String })
  petsPreference: string;

  @Prop({ type: [String] })
  religionPreference: string[];

  @Prop({ type: [String] })
  ethnicityPreference: string[];

  @Prop({ type: [String] })
  languagePreference: string[];

  @Prop({ type: [String] })
  interestsPreference: string[];
}

export const MatchPreferenceSchema = SchemaFactory.createForClass(MatchPreference);
