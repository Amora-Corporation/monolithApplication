import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateMatchDto } from "./dtos/match.create";
import { Match, MatchDocument } from "./schemas/match.schemas";
import { UpdateMatchDto } from "./dtos/match.update";

@Injectable()
export class MatchService {
  constructor(@InjectModel(Match.name) private readonly matchModel: Model<MatchDocument>) {}

  async createMatch (
    createMatchDto: CreateMatchDto,
  ): Promise<Match> {
    const createdMatch = new this.matchModel(createMatchDto);
    return createdMatch.save();
  }
  async getMatchById(id: string): Promise<Match> {
    return this.matchModel.findById(id).exec();
  }
  async getAllMatch (): Promise<Match[]> {
    return this.matchModel.find().exec();
  }

  async updateMatch(id: string, updateMatchDto: UpdateMatchDto): Promise<Match> {
    return this.matchModel.findByIdAndUpdate(id, updateMatchDto, { new: true }).exec();
  }

  async deleteMatch(id: string): Promise<boolean> {
    const result = await this.matchModel.deleteOne({ _id: id }).exec();
    return result.deletedCount === 1;
  }
}