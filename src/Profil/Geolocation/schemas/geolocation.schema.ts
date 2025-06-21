import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GeolocationDocument = Geolocation & Document;

@Schema({ timestamps: true })
export class Geolocation {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: (v: number[]) => v.length === 2,
        message: 'Les coordonnées doivent être un tableau [longitude, latitude]'
      }
    }
  })
  location: {
    type: string;
    coordinates: [number, number];
  };

  @Prop({ type: String })
  city: string;

  @Prop({ type: String })
  country: string;

  @Prop({ type: String })
  address: string;

  @Prop({ type: Number })
  accuracy: number;

  @Prop({ default: Date.now })
  lastUpdated: Date;
}

export const GeolocationSchema = SchemaFactory.createForClass(Geolocation); 

GeolocationSchema.index({ location: '2dsphere' });