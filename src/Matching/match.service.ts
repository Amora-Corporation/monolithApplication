import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateMatchDto } from './dtos/match.create';
import { Match, MatchDocument } from './schemas/match.schemas';
import { UpdateMatchDto } from './dtos/match.update';
import { CurrentUser } from 'src/auth/common/decorators/currentUser.decorator';
import { TokenDto } from 'src/auth/common/dto/token.dto';
@Injectable()
export class MatchService {
  
  constructor(
    @InjectModel(Match.name) private readonly matchModel: Model<MatchDocument>,
  ) {}

  async createMatch(createMatchDto: CreateMatchDto ): Promise<Match> {
    const createdMatch = new this.matchModel(createMatchDto);
    return createdMatch.save();
  }
  async getMatchById(id: string): Promise<Match> {
    return this.matchModel.findById(id).exec();
  }
  async getAllMatch(): Promise<Match[]> {
    return this.matchModel.find().exec();
  }

  async findMatchBetweenUsers(userId1: string, userId2: string): Promise<Match | null> {
    return this.matchModel.findOne({
      $or: [
        { userId1: new Types.ObjectId(userId1), userId2: new Types.ObjectId(userId2) },
        { userId1: new Types.ObjectId(userId2), userId2: new Types.ObjectId(userId1) },
      ],
    });
  }

  async updateMatch(
    id: string,
    updateMatchDto: UpdateMatchDto,
  ): Promise<Match> {
    return this.matchModel
      .findByIdAndUpdate(id, updateMatchDto, { new: true })
      .exec();
  }

  async deleteMatch(id: string): Promise<boolean> {
    const result = await this.matchModel.deleteOne({ _id: id }).exec();
    return result.deletedCount === 1;
  }

  async getAllMatchForCurrentUser(@CurrentUser() user: TokenDto): Promise<Match[]> {
    return this.matchModel.find({
      $or: [
        { userId1: new Types.ObjectId(user._id) },
        { userId2: new Types.ObjectId(user._id) },
      ],
    }).exec();
  }
}
