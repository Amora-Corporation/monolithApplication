import { InjectModel } from '@nestjs/mongoose';
import {
  MatchPreference,
  MatchPreferenceDocument,
} from './schemas/matchPreference.schemas';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CreateMatchPreferenceDto } from './dtos/matchPreference.create';
import { UpdateMatchPreferenceDto } from './dtos/matchPreference.update';

@Injectable()
export class MatchPreferenceService {
  constructor(
    @InjectModel(MatchPreference.name)
    private matchPreferenceModel: Model<MatchPreferenceDocument>,
  ) {}

  async createMatchPreference(
    createMatchPreferenceDto: CreateMatchPreferenceDto,
  ): Promise<MatchPreference> {
    const createdMatchPreference = new this.matchPreferenceModel(
      createMatchPreferenceDto,
    );
    return await createdMatchPreference.save();
  }
  async getAllMatchPreferences(): Promise<MatchPreference[]> {
    return this.matchPreferenceModel.find().exec();
  }

  async getMatchPreferenceById(id: string): Promise<MatchPreference> {
    return this.matchPreferenceModel.findById(id).exec();
  }

  async updateMatchPreference(
    id: string,
    updateMatchPreferenceDto: UpdateMatchPreferenceDto,
  ): Promise<MatchPreference> {
    return this.matchPreferenceModel
      .findByIdAndUpdate(id, updateMatchPreferenceDto, { new: true })
      .exec();
  }

  async deleteMatchPreference(id: string): Promise<boolean> {
    const result = await this.matchPreferenceModel
      .deleteOne({ _id: id })
      .exec();
    return result.deletedCount === 1;
  }
}
