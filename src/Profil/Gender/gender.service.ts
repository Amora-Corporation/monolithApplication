import { Gender, GenderDocument } from "./schemas/gender.schemas";
import { Inject } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateMatchDto } from "../../Matching/dtos/match.create";
import { CreateGerderDTO } from "./dtos/gender.create";


export class GenderService {
  constructor(@InjectModel(Gender.name) private genderModel: Model<GenderDocument>) {
  }
  async getAllGenders(): Promise<Gender[]> {
    return this.genderModel.find().exec();
  }
  async createGender(createGenderDTO: CreateGerderDTO): Promise<Gender> {
    const createdGender = new this.genderModel(createGenderDTO)
    return createdGender.save();
  }
}