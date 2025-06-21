import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Gender } from 'src/Profil/Gender/schemas/gender.schemas';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: Types.ObjectId, required: true, auto: true })
  _id: Types.ObjectId;

  @Prop({ default: '' })
  first_name: string;

  @Prop({ default: null, type: Types.ObjectId , ref: Gender.name})
  gender_ID: Types.ObjectId;

  @Prop({ default: 0 })
  popularity: number;

  @Prop({ default: null })
  birthdate: Date;

  @Prop({ type: [String], default: [] })
  interests: string[];

  @Prop({ type: [String], default: [] })
  photos: string[];

  // @Prop({ type: Object, default: { min: 18, max: 99 } })
  // age_range: {
  //   min: number;
  //   max: number;
  // };

  // @Prop({ type: [Types.ObjectId], default: [] })
  // interested_genre: Types.ObjectId[];

  @Prop({ default: false })
  verification_status: boolean;

  @Prop({ default: Date.now })
  last_active: Date;

  // @Prop({ type: Object, default: { min: 0, max: 100 } })
  // preferred_distance_range: {
  //   min: number;
  //   max: number;
  // };

  // @Prop({ default: '' })
  // looking_for: string;

  @Prop({ default: false })
  smoker: boolean;

  @Prop({ default: '' })
  drinker: string;

  // @Prop({ default: '' })
  // children: string;

  @Prop({ type: Object, default: {} })
  social_media_links: {
    [key: string]: string;
  };
  
  @Prop({ default: '' })
  bio: string;

  @Prop({ default: true })
  empty_account: boolean;

  // @Prop({ default: '' })
  // education: string;

  // @Prop({ default: '' })
  // occupation: string;

  // @Prop({ default: '' })
  // nickname: string;

  
  // @Prop({ default: ''  })
  // last_name: string;

  // @Prop({ type: [String], default: [] })
  // hobbies: string[];

  // @Prop({ default: '' })
  // relationship_status: string;

  // @Prop({ type: [String], default: [] })
  // languages: string[];

  // @Prop({ default: 0 })
  // height: number;

  // @Prop({ default: 0 })
  // weight: number;

  // @Prop({ default: '' })
  // ethnicity: string;

  // @Prop({ default: '' })
  // religion: string;

  
  
  // @Prop({ default: '' })
  // zodiac_sign: string;

  // @Prop({ default: '' })
  // personality_type: string;

  // @Prop({ type: [String], default: [] })
  // pets: string[];

  // @Prop({ default: 0 })
  // profile_completeness: number;

  // @Prop({ default: false })
  // verified_photos: boolean;

  // @Prop({ type: [String], default: [] })
  // preferred_communication_style: string[];

  // @Prop({ type: [String], default: [] })
  // deal_breakers: string[];

  // @Prop({ default: '' })
  // vaccination_status: string;

  // @Prop({ default: '' })
  // political_views: string;

  // @Prop({ type: [String], default: [] })
  // favorite_music: string[];

  // @Prop({ type: [String], default: [] })
  // favorite_movies: string[];

  // @Prop({ type: [String], default: [] })
  // favorite_tv_shows: string[];

  // @Prop({ default: '' })
  // travel_frequency: string;

  // @Prop({ default: '' })
  // work_life_balance: string;

  // @Prop({ default: '' })
  // exercise_frequency: string;

  // @Prop({ type: [String], default: [] })
  // dietary_preferences: string[];

  // @Prop({ default: '' })
  // dream_vacation: string;


}

export const UserSchema = SchemaFactory.createForClass(User);
