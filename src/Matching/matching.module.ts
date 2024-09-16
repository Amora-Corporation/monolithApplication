import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from "../Profil/User/schemas/user.schema";
import { InteractionService } from "./interaction.service";

import { Interaction, InteractionSchema } from "./schemas/Interaction.schemas";
import { InteractionController } from "./controllers/interaction.controller";
import { Match, MatchSchema } from "./schemas/match.schemas";
import { MatchService } from "./match.service";
import { MatchController } from "./controllers/match.controller";
import { MatchPreference, MatchPreferenceSchema } from "./schemas/matchPreference.schemas";
import { MatchPreferenceController } from "./controllers/matchPreference.controller";
import { MatchPreferenceService } from "./matchPreference.service";
import { Conversation, ConversationSchema } from "./Conversation/schemas/conversation.schema";
import { Message, MessageSchema } from "./Conversation/schemas/message.schemas";


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema }
    ]),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ]),
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema }
    ]),
    MongooseModule.forFeature([
      { name: Interaction.name, schema: InteractionSchema }
    ]),
    MongooseModule.forFeature([
      { name: Match.name, schema: MatchSchema }
    ]),
    MongooseModule.forFeature([
      { name: MatchPreference.name, schema: MatchPreferenceSchema }
    ]),
  ],
  controllers: [InteractionController,MatchController,MatchPreferenceController],
  providers: [InteractionService,MatchService,MatchPreferenceService],
})
export class MatchingModule {}
