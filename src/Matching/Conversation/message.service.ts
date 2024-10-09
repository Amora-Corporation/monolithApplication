import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Message, MessageDocument } from "./schemas/message.schemas";
import { Model } from "mongoose";
import { CreateMessageDTO } from "./dtos/create.message";
import { Conversation, ConversationDocument } from "./schemas/conversation.schema";
import { UpdateMessageDTO } from "./dtos/update.message";
import { User, UserDocument } from "../../Profil/User/schemas/user.schema";

@Injectable()
export class MessageService {
  constructor(@InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>,
              @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
              @InjectModel(Conversation.name) private readonly ConversationModel: Model<ConversationDocument>,){}

  async create(
    createMessageDTO: CreateMessageDTO,
  ):Promise<Message>{
    //console.log(createMessageDTO.conversation_Id)
    const conversation = await this.ConversationModel.findById(createMessageDTO.conversation_Id)
    const sender = await this.userModel.findById(createMessageDTO.sender_Id);
    //console.log("conversation",conversation)
    //console.log("sender",sender)
    if (!sender || !conversation) {
      throw new NotFoundException('Conversation ou utilisateur existe pas');
    }
    const createdMessage = new this.messageModel(createMessageDTO)
    return await createdMessage.save()
  }
  async findAll(): Promise<Message[]> {
    return this.messageModel.find().exec();
  }

  async findOne(id: string): Promise<Message> {
    return this.messageModel.findById(id).exec();
  }

  async update(id: string, updateMessageDTO: UpdateMessageDTO): Promise<Message> {
    return this.messageModel.findByIdAndUpdate(id, updateMessageDTO, { new: true }).exec();
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.messageModel.deleteOne({ _id: id }).exec();
    return result.deletedCount === 1;
  }
}