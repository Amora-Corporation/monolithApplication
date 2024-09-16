import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: Types.ObjectId, required: true, auto: true })
  _id: Types.ObjectId;

  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop()
  gender_ID: number;

  @Prop()
  nickname: string;

  @Prop({ required: true, unique: true })
  email: string;

  // @Prop({ required: true })
  // password: string;

  @Prop()
  resetPasswordToken: string;

  @Prop()
  resetPasswordExpires: Date;

  @Prop({ default: 0 })
  popularity: number;

  @Prop()
  birthdate: Date;

  @Prop()
  location: string;

  @Prop({ type: [String] })
  interests: string[];

  @Prop({ type: [String] })
  photos: string[];

  @Prop({ type: Object })
  age_range: {
    min: number;
    max: number;
  };

  @Prop()
  education: string;

  @Prop()
  occupation: string;

  @Prop()
  bio: string;

  @Prop({ type: [String] })
  hobbies: string[];

  @Prop()
  relationship_status: string;

  @Prop({ type: [String] })
  languages: string[];

  @Prop()
  height: number;

  @Prop()
  weight: number;

  @Prop()
  ethnicity: string;

  @Prop()
  religion: string;

  @Prop({ type: [Number] })
  interested_genre: number[];

  @Prop({ default: false })
  verification_status: boolean;

  @Prop({ default: Date.now })
  last_active: Date;

  @Prop({ type: Object })
  preferred_distance_range: {
    min: number;
    max: number;
  };

  @Prop()
  looking_for: string;

  @Prop()
  zodiac_sign: string;

  @Prop()
  personality_type: string;

  @Prop({ default: false })
  smoker: boolean;

  @Prop()
  drinker: string;

  @Prop()
  children: string;

  @Prop({ type: [String] })
  pets: string[];

  @Prop({ default: 0 })
  profile_completeness: number;

  @Prop({ default: false })
  verified_photos: boolean;

  @Prop({ type: Object })
  social_media_links: {
    [key: string]: string;
  };

  @Prop({ type: [String] })
  preferred_communication_style: string[];

  @Prop({ type: [String] })
  deal_breakers: string[];

  @Prop()
  vaccination_status: string;

  @Prop()
  political_views: string;

  @Prop({ type: [String] })
  favorite_music: string[];

  @Prop({ type: [String] })
  favorite_movies: string[];

  @Prop({ type: [String] })
  favorite_tv_shows: string[];

  @Prop()
  travel_frequency: string;

  @Prop()
  work_life_balance: string;

  @Prop()
  exercise_frequency: string;

  @Prop({ type: [String] })
  dietary_preferences: string[];

  @Prop()
  dream_vacation: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
