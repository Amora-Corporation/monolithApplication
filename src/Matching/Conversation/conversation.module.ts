import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './controllers/conversation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationSchema,
} from './schemas/conversation.schema';
import { Message, MessageSchema } from './schemas/message.schemas';
import { MessageService } from './message.service';
import { MessageController } from './controllers/message.controller';
import { User, UserSchema } from '../../Profil/User/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  providers: [ConversationService, MessageService],
  controllers: [ConversationController, MessageController],
})
export class ConversationModule {}
