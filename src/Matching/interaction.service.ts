import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../Profil/User/schemas/user.schema';
import { CreateInteractionDto, InteractionType } from './dtos/Interaction.create';
import {
  Interaction,
  InteractionDocument,
} from './schemas/Interaction.schemas';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dtos/match.create';
import { UpdateInteractionDto } from './dtos/Interaction.update';
import { TokenDto } from 'src/auth/common/dto/token.dto';

@Injectable()
export class InteractionService {
  constructor(
    @InjectModel(Interaction.name)
    private readonly interactionModel: Model<InteractionDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly matchService: MatchService,
  ) { }
  async createInteration(createInterationDTO: CreateInteractionDto, user: TokenDto): Promise<Interaction> {
    const senderId = new Types.ObjectId(user._id);
    const receiverId = new Types.ObjectId(createInterationDTO.receiver_user_ID);

    if (senderId.equals(receiverId)) {
      throw new ConflictException('Sender and receiver cannot be the same user');
    }

    const [senderUser, receiverUser] = await Promise.all([
      this.userModel.findById(senderId),
      this.userModel.findById(receiverId),
    ]);

    if (!senderUser || !receiverUser) {
      throw new NotFoundException('Sender or Receiver not found');
    }

    const [existingInteraction, reciprocalLike] = await Promise.all([
      this.interactionModel.findOne({ sender_user_ID: senderId, receiver_user_ID: receiverId }),
      this.interactionModel.findOne({ sender_user_ID: receiverId, receiver_user_ID: senderId, likeType: InteractionType.LIKE }),
    ]);

    let interaction: Interaction;

    if (existingInteraction) {
      existingInteraction.likeType = createInterationDTO.likeType;
      existingInteraction.date_sent = new Date();
      interaction = await existingInteraction.save();
    } else {
      const createdInteraction = new this.interactionModel({
        sender_user_ID: senderId,
        receiver_user_ID: receiverId,
        likeType: createInterationDTO.likeType,
        date_sent: new Date(),
      });
      interaction = await createdInteraction.save();
    }

    if (reciprocalLike && createInterationDTO.likeType === InteractionType.LIKE) {
      const [userId1, userId2] = senderId < receiverId ? [senderId, receiverId] : [receiverId, senderId];

      const existingMatch = await this.matchService.findMatchBetweenUsers(userId1.toString(), userId2.toString());

      if (!existingMatch) {
        await this.matchService.createMatch({
          userId1,
          userId2,
          matchDate: new Date(),
          isActive: true,
        });
      }
    }
    return interaction;
  }

  async findAll(): Promise<Interaction[]> {
    return this.interactionModel.find().exec();
  }

  async findOne(id: string): Promise<Interaction> {
    return this.interactionModel.findById(id).exec();
  }

  async update(
    id: string,
    updateInteractionDto: UpdateInteractionDto,
  ): Promise<Interaction> {
    return this.interactionModel
      .findByIdAndUpdate(id, updateInteractionDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.interactionModel.deleteOne({ _id: id }).exec();
    return result.deletedCount === 1;
  }
}
