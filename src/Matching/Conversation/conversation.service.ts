import { Injectable, NotFoundException } from "@nestjs/common";
import { ApiTags } from '@nestjs/swagger';
import { InjectModel } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationDocument,
} from './schemas/conversation.schema';
import { Model, Types } from "mongoose";
import { CreateConversationDto } from './dtos/create.conversation';
import { User, UserDocument } from "../Profil/schemas/profil.schema";

@Injectable()
@ApiTags('Conversation')
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(
    createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    const createdConversation = new this.conversationModel({
        ...createConversationDto,
      }
    );
    const userIds = createdConversation.participants_ID;
    const existingUsers= await this.userModel.find({ _id :{$in: userIds } }).exec();
    console.log(existingUsers);

    if (existingUsers.length !== userIds.length) {
      throw new NotFoundException("il y'a un utilisateur qui m'existe pas")
    }

    return createdConversation.save();
  }

  async getAllConversations(): Promise<Conversation[]> {
    return this.conversationModel.find().exec();
  }

  async getConversation(id: string): Promise<Conversation | null> {
    const conversation = await this.conversationModel.findById(id).exec();
    if (!conversation) {
      throw new NotFoundException("conversation ne existe pas")
    }
    return conversation;
  }
}
