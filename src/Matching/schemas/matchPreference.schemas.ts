import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type MatchPreferenceDocument = MatchPreference & Document;

@Schema({ timestamps: true })
export class MatchPreference {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Gender' }], required: true })
  genderPreference: Types.ObjectId[];

  @Prop({ type: { min: Number, max: Number }, required: true, _id: false })
  ageRange: { min: number; max: number };

  @Prop({ type: { min: Number, max: Number }, required: true, _id: false })
  distanceRange: { min: number; max: number };

  // @Prop({ type: { min: Number, max: Number }, required: true })
  // heightRange: { min: number; max: number };

  // @Prop({ type: [String] })
  // bodyTypePreference: string[];

  // @Prop({ type: [String] })
  // educationLevelPreference: string[];

  // @Prop({ type: [String] })
  // relationshipStatusPreference: string[];

  // @Prop({ type: String })
  // smokingPreference: string;

  // @Prop({ type: String })
  // drinkingPreference: string;

  // @Prop({ type: String })
  // childrenPreference: string;

  // @Prop({ type: String })
  // petsPreference: string;

  // @Prop({ type: [String] })
  // religionPreference: string[];

  // @Prop({ type: [String] })
  // ethnicityPreference: string[];

  // @Prop({ type: [String] })
  // languagePreference: string[];

  @Prop({ type: [String] })
  interestsPreference: string[];
}

export const MatchPreferenceSchema =
  SchemaFactory.createForClass(MatchPreference);
