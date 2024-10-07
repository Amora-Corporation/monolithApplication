import { Gender, GenderDocument } from "./schemas/gender.schemas";
import { Inject } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateMatchDto } from "../../Matching/dtos/match.create";
import { CreateGerderDTO } from "./dtos/gender.create";
import { UpdateGenderDTO } from "./dtos/gender.update";


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
  async updateGender(id: string, updateGenderDto: UpdateGenderDTO): Promise<Gender> {
    return this.genderModel.findByIdAndUpdate(id, updateGenderDto, { new: true }).exec();
  }

  async deleteGender(id: string): Promise<Gender> {
    return this.genderModel.findByIdAndDelete(id).exec();
  }
}