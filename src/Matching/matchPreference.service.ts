import { InjectModel } from '@nestjs/mongoose';
import {
  MatchPreference,
  MatchPreferenceDocument,
} from './schemas/matchPreference.schemas';
import { Model, Types } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMatchPreferenceDto } from './dtos/matchPreference.create';
import { UpdateMatchPreferenceDto } from './dtos/matchPreference.update';
import { TokenDto } from 'src/auth/common/dto/token.dto';

@Injectable()
export class MatchPreferenceService {
  constructor(
    @InjectModel(MatchPreference.name) private readonly matchPreferenceModel: Model<MatchPreference>,
  ) { }

  async createMatchPreference(createMatchPreferenceDto: CreateMatchPreferenceDto, user: TokenDto): Promise<MatchPreference> {
    
    let existingMatchPreference = await this.matchPreferenceModel.findOne({ userId: new Types.ObjectId(user._id) });

    if (!existingMatchPreference) {
      existingMatchPreference = new this.matchPreferenceModel(
        {
          ...createMatchPreferenceDto,
          userId: new Types.ObjectId(user._id),
        },
      );

    }
    else {
      existingMatchPreference = await this.matchPreferenceModel.findByIdAndUpdate(
        existingMatchPreference._id,
        createMatchPreferenceDto,
        { new: true },
      );
    }
    // Sauvegarder uniquement si c'est un nouveau document
    if (existingMatchPreference.isNew) {
      await existingMatchPreference.save();
    }
    return existingMatchPreference;
  }


  async getAllMatchPreferences(): Promise<MatchPreference[]> {
    return this.matchPreferenceModel.find().exec();
  }

  async getMatchPreferenceById(id: string): Promise<MatchPreference> {
    console.log("Preference", id)
    const objectId = new Types.ObjectId(id);
    const preference = await this.matchPreferenceModel.findOne({ userId: objectId }).exec();
    console.log("preference", preference)
    if (!preference) {
      throw new NotFoundException('Match preference not found');
    }
    return preference;
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
