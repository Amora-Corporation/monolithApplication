import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User, UserDocument } from "../Profil/User/schemas/user.schema";
import { CreateInteractionDto } from "./dtos/Interaction.create";
import { Interaction, InteractionDocument } from "./schemas/Interaction.schemas";
import { MatchService } from "./match.service";
import { CreateMatchDto } from "./dtos/match.create";
import { UpdateInteractionDto } from "./dtos/Interaction.update";


@Injectable()
export class InteractionService {
  constructor(@InjectModel(Interaction.name) private readonly interactionModel: Model<InteractionDocument>,
              @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
              private readonly matchService: MatchService) {
  }

  async createLikes(
    createLikeDTO: CreateInteractionDto
  ): Promise<Interaction> {

    if (createLikeDTO.receiver_user_ID === createLikeDTO.sender_user_ID) {
      throw new NotFoundException("Sender and receiver ID same");
    }
    //console.log("createLikeDTO.receiver_user_ID"+createLikeDTO.receiver_user_ID)
    
    const [senderUser, receiverUser] = await Promise.all([
      this.userModel.findById(new Types.ObjectId(createLikeDTO.sender_user_ID)),
      this.userModel.findById(new Types.ObjectId(createLikeDTO.receiver_user_ID))
    ]);



    if (!receiverUser || !senderUser) {
      throw new NotFoundException("Sender Or Receiver User Not Found");
    }
    const [existingLike,existingMatch] = await Promise.all ([
      this.interactionModel.findOne({
      sender_user_ID: createLikeDTO.sender_user_ID,
      receiver_user_ID: createLikeDTO.receiver_user_ID
    }),
      this.interactionModel.findOne({
        receiver_user_ID: createLikeDTO.sender_user_ID,
        sender_user_ID: createLikeDTO.receiver_user_ID
      })
    ])


    let interaction: Interaction;

    if (existingLike) {
      existingLike.likeType = "like";
        existingLike.date_sent = new Date();
      interaction = await existingLike.save();
    } else {
      const createdLikes = new this.interactionModel({
        ...createLikeDTO,
        likeType: "like"
      });
      interaction =  await createdLikes.save();
    }

    if (existingMatch){
      const matchDto: CreateMatchDto ={
        userId1: createLikeDTO.sender_user_ID,
        userId2: createLikeDTO.receiver_user_ID,
        matchDate: new Date(),
        isActive: true
      };
      const newMatch = await this.matchService.createMatch(matchDto);
    }
    return interaction;
  }

  async createDislikes(
    createDislikeDTO: CreateInteractionDto
  ): Promise<Interaction> {

    if (createDislikeDTO.receiver_user_ID === createDislikeDTO.sender_user_ID) {
      throw new NotFoundException("Sender and receiver ID same");
    }
    const [senderUser, receiverUser] = await Promise.all([
      this.userModel.findById(new Types.ObjectId(createDislikeDTO.sender_user_ID)),
      this.userModel.findById(new Types.ObjectId(createDislikeDTO.receiver_user_ID))
    ]);

    if (!receiverUser || !senderUser) {
      throw new NotFoundException("Sender Or Receiver User Not Found");
    }

    const existingDislike = await this.interactionModel.findOne({
      sender_user_ID: createDislikeDTO.sender_user_ID,
      receiver_user_ID: createDislikeDTO.receiver_user_ID
    });

    if (existingDislike) {
        existingDislike.likeType = "dislike",
        existingDislike.date_sent = new Date();
      return await existingDislike.save();
    } else {
      const createdLikes = new this.interactionModel({
        ...createDislikeDTO,
        likeType: "dislike"
      });

      return await createdLikes.save();
    }


  }

  async findAll(): Promise<Interaction[]> {
    return this.interactionModel.find().exec();
  }

  async findOne(id: string): Promise<Interaction> {
    return this.interactionModel.findById(id).exec();
  }

  async update(id: string, updateInteractionDto: UpdateInteractionDto): Promise<Interaction> {
    return this.interactionModel.findByIdAndUpdate(id, updateInteractionDto, { new: true }).exec();
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.interactionModel.deleteOne({ _id: id }).exec();
    return result.deletedCount === 1;
  }
}

