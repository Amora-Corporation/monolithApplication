import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../Profil/User/schemas/user.schema';
import { InteractionService } from './interaction.service';

import { Interaction, InteractionSchema } from './schemas/Interaction.schemas';
import { InteractionController } from './controllers/interaction.controller';
import { Match, MatchSchema } from './schemas/match.schemas';
import { MatchService } from './match.service';
import { MatchController } from './controllers/match.controller';
import {
  MatchPreference,
  MatchPreferenceSchema,
} from './schemas/matchPreference.schemas';
import { MatchPreferenceController } from './controllers/matchPreference.controller';
import { MatchPreferenceService } from './matchPreference.service';
import {
  Conversation,
  ConversationSchema,
} from './Conversation/schemas/conversation.schema';
import { Message, MessageSchema } from './Conversation/schemas/message.schemas';
import { JwtModule } from '@nestjs/jwt';
import { ProfileSuggestion, ProfileSuggestionSchema } from './schemas/profileSuggestion.schema';
import { ProfileSuggestionService } from './profileSuggestion.service';
import { ProfileSuggestionController } from './controllers/profileSuggestion.controller';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './controllers/recommendation.controller';
import { GeolocationModule } from '../Profil/Geolocation/geolocation.module';
import { Geolocation, GeolocationSchema } from '../Profil/Geolocation/schemas/geolocation.schema';
@Module({
  imports: [
    JwtModule.register({}),
    GeolocationModule,
    MongooseModule.forFeature([
      { name: Geolocation.name, schema: GeolocationSchema },
    ]),
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MongooseModule.forFeature([
      { name: Interaction.name, schema: InteractionSchema },
    ]),
    MongooseModule.forFeature([{ name: Match.name, schema: MatchSchema }]),
    MongooseModule.forFeature([
      { name: MatchPreference.name, schema: MatchPreferenceSchema },
    ]),
    MongooseModule.forFeature([
      { name: ProfileSuggestion.name, schema: ProfileSuggestionSchema },
    ]),
  ],
  controllers: [
    InteractionController,
    MatchController,
    MatchPreferenceController,
    ProfileSuggestionController,
    RecommendationController,
  ],
  providers: [
    InteractionService, 
    MatchService, 
    MatchPreferenceService,
    ProfileSuggestionService,
    RecommendationService,
  ],
})
export class MatchingModule {}
