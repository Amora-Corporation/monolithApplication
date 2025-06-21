import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/message.schemas';
import { Model, Types } from 'mongoose';
import { CreateMessageDTO } from './dtos/create.message';
import {
  Conversation,
} from './schemas/conversation.schema';
import { UpdateMessageDTO } from './dtos/update.message';
import { User } from '../../Profil/User/schemas/user.schema';

@Injectable()
export class EnhancedMessageService {
  private readonly logger = new Logger(EnhancedMessageService.name);

  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,
    @InjectModel(User.name) 
    private readonly userModel: Model<User>,
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,
    // private readonly notificationService: NotificationService,
    // private readonly websocketGateway: WebsocketGateway
  ) {}

  async create(createMessageDTO: CreateMessageDTO): Promise<Message> {
    try {
      // Vérifier l'existence de la conversation et de l'utilisateur
      const conversation = await this.conversationModel.findById(
        createMessageDTO.conversation_Id,
      );
      
      if (!conversation) {
        throw new NotFoundException('Conversation non trouvée');
      }

      const sender = await this.userModel.findById(createMessageDTO.sender_Id);
      
      if (!sender) {
        throw new NotFoundException('Utilisateur non trouvé');
      }

      // Créer le message
      const createdMessage = new this.messageModel(createMessageDTO);
      const savedMessage = await createdMessage.save();

      // Envoyer le message via WebSocket à tous les participants de la conversation
      // await this.websocketGateway.sendMessageToConversation(
      //     conversation._id.toString(),
      //     savedMessage
      //   );

      // Envoyer des notifications aux autres participants
      for (const participantId of conversation.participants_ID) {
        // Ne pas envoyer de notification à l'expéditeur du message
        if (participantId.toString() === createMessageDTO.sender_Id.toString()) {
          continue;
        }

        const recipient = await this.userModel.findById(participantId);
        
        if (recipient) {
          // Créer une notification pour chaque participant
          // await this.notificationService.createMessageNotification(
          //   new Types.ObjectId(participantId.toString()),
          //   `${sender.first_name} ${sender.last_name}`,
          //   new Types.ObjectId(savedMessage._id.toString()),
          //   new Types.ObjectId(conversation._id.toString()),
          //   savedMessage.content
          // );
        }
      }

      return savedMessage;
    } catch (error) {
      this.logger.error(`Erreur lors de la création du message: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(): Promise<Message[]> {
    return this.messageModel.find().exec();
  }

  async findOne(id: string): Promise<Message> {
    return this.messageModel.findById(id).exec();
  }

  async findByConversation(conversationId: string): Promise<Message[]> {
    return this.messageModel
      .find({ conversation_Id: conversationId })
      .sort({ timestamp: 1 })
      .exec();
  }

  async update(
    id: string,
    updateMessageDTO: UpdateMessageDTO,
  ): Promise<Message> {
    const updatedMessage = await this.messageModel
      .findByIdAndUpdate(id, updateMessageDTO, { new: true })
      .exec();
      
    if (updatedMessage) {
      // Récupérer la conversation
      const conversation = await this.conversationModel.findById(
        updatedMessage.conversation_Id
      );
      
      if (conversation) {
        // Notifier les clients WebSocket de la mise à jour
        // await this.websocketGateway.sendMessageToConversation(
        //   conversation._id.toString(),
        //   updatedMessage
        // );
      }
    }
    
    return updatedMessage;
  }

  async remove(id: string): Promise<boolean> {
    const message = await this.messageModel.findById(id).exec();
    
    if (!message) {
      return false;
    }
    
    const conversationId = message.conversation_Id.toString();
    const result = await this.messageModel.deleteOne({ _id: id }).exec();
    
    if (result.deletedCount === 1) {
      // Notifier les clients WebSocket de la suppression
      // this.websocketGateway.server
      //   .to(`conversation:${conversationId}`)
      //   .emit('messageDeleted', { messageId: id });
      
      return true;
    }
    
    return false;
  }

  async markAsRead(messageId: string, userId: string): Promise<Message> {
    const message = await this.messageModel.findById(messageId).exec();
    
    if (!message) {
      throw new NotFoundException('Message non trouvé');
    }
    
    // Logique de marquage comme lu (ici nous pourrions ajouter un champ readBy dans le schéma de message)
    // Pour l'exemple, nous allons simplement retourner le message
    
    // Notifier l'expéditeur que son message a été lu
    // this.websocketGateway.server
    //   .to(`user:${message.sender_Id.toString()}`)
    //   .emit('messageRead', { 
    //     messageId: message._id.toString(),
    //     readBy: userId,
    //     conversationId: message.conversation_Id.toString()
    //   });
    
    return message;
  }

  async sendTypingStatus(conversationId: string, userId: string, isTyping: boolean): Promise<void> {
    // await this.websocketGateway.sendTypingStatus(conversationId, userId, isTyping);
  }
} 