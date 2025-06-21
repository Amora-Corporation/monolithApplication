import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Geolocation, GeolocationDocument } from './schemas/geolocation.schema';
import { CreateGeolocationDto, UpdateGeolocationDto } from './dtos/geolocation.dto';
import { User, UserDocument } from '../User/schemas/user.schema';

@Injectable()
export class GeolocationService {
  constructor(
    @InjectModel(Geolocation.name)
    private readonly geolocationModel: Model<GeolocationDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  private buildLocation(latitude: number, longitude: number) {
    return {
      type: 'Point',
      coordinates: [longitude, latitude], // Attention à l'ordre
    };
  }
  
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  
  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  async createGeolocation(
    userId: string,
    dto: CreateGeolocationDto,
  ): Promise<Geolocation> {
    const existingUser = await this.userModel.findById(new Types.ObjectId(userId)).exec();
    if (!existingUser) throw new NotFoundException('Utilisateur non trouvé');

    const existingGeolocation = await this.geolocationModel.findOne({
      userId: new Types.ObjectId(userId),
    }).exec();

    const location = this.buildLocation(dto.latitude, dto.longitude);

    if (existingGeolocation) {
      return this.updateGeolocationByUserId(userId, dto);
    }

    const createdGeolocation = new this.geolocationModel({
      ...dto,
      userId: new Types.ObjectId(userId),
      location,
    });
    return createdGeolocation.save();
  }

  async updateGeolocationByUserId(
    userId: string,
    dto: UpdateGeolocationDto,
  ): Promise<Geolocation> {
    const location = this.buildLocation(dto.latitude, dto.longitude);

    return this.geolocationModel
      .findOneAndUpdate(
        { userId: new Types.ObjectId(userId) },
        { ...dto, location, lastUpdated: new Date() },
        { new: true },
      )
      .exec();
  }

  async getGeolocationByUserId(userId: string): Promise<Geolocation> {
    const objectId = new Types.ObjectId(userId);
    const geolocation = await this.geolocationModel.findOne({ userId: objectId }).exec();
    if (!geolocation) throw new NotFoundException('Géolocalisation non trouvée pour cet utilisateur');
    return geolocation;
  }

  async deleteGeolocation(userId: string): Promise<boolean> {
    const result = await this.geolocationModel.deleteOne({ userId: new Types.ObjectId(userId) }).exec();
    return result.deletedCount > 0;
  }

  async getNearbyUsers(user: { _id: string }, maxDistanceKm: number): Promise<User[]> {
    const userGeo = await this.getGeolocationByUserId(user._id);
    if (!userGeo) return [];

    const geolocations = await this.geolocationModel.find({
      location: {
        $near: {
          $geometry: userGeo.location,
          $maxDistance: maxDistanceKm * 1000, // mètre
        },
      },
      userId: { $ne: new Types.ObjectId(user._id) },
    })
    .populate('userId')
    .limit(10)
    .exec();
    
    console.log("geolocations", geolocations[0])
    return geolocations.map(geo => {
    const user = (geo.userId as any).toObject();

    const distance = this.calculateDistance(
      userGeo.location.coordinates[1],
      userGeo.location.coordinates[0],
      geo.location.coordinates[1],
      geo.location.coordinates[0],
    );

    return {
      ...user,
      distance,
      location: {
        latitude: geo.location.coordinates[1],
        longitude: geo.location.coordinates[0],
        city: geo.city,
        country: geo.country,
        address: geo.address,
        accuracy: geo.accuracy,
      },
    };
  });
  }

  // async getUsersWithinRadius(latitude: number, longitude: number, radiusKm: number): Promise<User[]> {
  //   const geolocations = await this.geolocationModel.find({
  //     location: {
  //       $geoWithin: {
  //         $centerSphere: [
  //           [longitude, latitude], // [lng, lat]
  //           radiusKm / 6378.1, // rayon en radians
  //         ],
  //       },
  //     },
  //   }).populate('userId').exec();

  //   return geolocations.map(g => g.userId as unknown as User);
  // }
}
