import { Injectable, NotFoundException } from '@nestjs/common';
import { Photo, PhotoDocument } from './schemas/photo.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePhotoDto } from './dtos/create.photo';

@Injectable()
export class PhotoService {
  constructor(
    @InjectModel(Photo.name) private modelPhoto: Model<PhotoDocument>,
  ) {}

  async getAllPhotos(): Promise<Photo[]> {
    return this.modelPhoto.find().exec();
  }

  async getPhotoById(id: string): Promise<Photo> {
    const photo = await this.modelPhoto.findById(id).exec();
    if (!photo) {
      throw new NotFoundException(`Photo with ID "${id}" not found`);
    }
    return photo;
  }

  async createPhoto(createPhotoDto: CreatePhotoDto): Promise<Photo> {
    const newPhoto = new this.modelPhoto(createPhotoDto);
    return newPhoto.save();
  }

  /*async updatePhoto(id: string, updatePhotoDto: UpdatePhotoDto): Promise<Photo> {
    const updatedPhoto = await this.modelPhoto
      .findByIdAndUpdate(id, updatePhotoDto, { new: true })
      .exec();
    if (!updatedPhoto) {
      throw new NotFoundException(`Photo with ID "${id}" not found`);
    }
    return updatedPhoto;
  }*/

  async deletePhoto(id: string): Promise<void> {
    const result = await this.modelPhoto.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Photo with ID "${id}" not found`);
    }
  }

  async getPhotosByUserId(userId: string): Promise<Photo[]> {
    return this.modelPhoto.find({ userId: userId }).exec();
  }
}
