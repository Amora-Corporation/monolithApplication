import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { 
  Conversation, 
  ConversationSchema 
} from './schemas/conversation.schema';
import { 
  Message, 
  MessageSchema 
} from './schemas/message.schemas';
import {
  EnhancedMessage,
  EnhancedMessageSchema
} from './schemas/enhanced-message.schema';
import { User, UserSchema } from '../../Profil/User/schemas/user.schema';
import { ConversationService } from './conversation.service';
import { MessageService } from './message.service';
import { EnhancedMessageService } from './message.enhanced.service';
import { EnhancedMessageController } from './controllers/message.enhanced.controller';
// import { NotificationModule } from '../../../../backerecuperation/Notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema },
      { name: EnhancedMessage.name, schema: EnhancedMessageSchema },
      { name: User.name, schema: UserSchema },
    ]),
    JwtModule.register({
      global: true,
    }),
    // NotificationModule,
  ],
  controllers: [EnhancedMessageController],
  providers: [ConversationService, MessageService, EnhancedMessageService],
  exports: [ConversationService, MessageService, EnhancedMessageService],
})
export class ConversationModule {}
