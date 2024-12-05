import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ConversationService } from '../conversation.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateConversationDto } from '../dtos/create.conversation';
import { Conversation } from '../schemas/conversation.schema';

@ApiTags('messaging')
@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}
  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle conversation' })
  @ApiResponse({
    status: 201,
    description: ' la conversation a bien été créé avec succès ',
    type: Conversation,
  })
  @ApiBody({ type: CreateConversationDto })
  async create(
    @Body() createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    return this.conversationService.create(createConversationDto);
  }

  @Get()
  @ApiOperation({ summary: 'retourner tout les conversations' })
  @ApiResponse({
    status: 200,
  })
  async getAllConversation(): Promise<Conversation[]> {
    return this.conversationService.getAllConversations();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une conversation par ID' })
  @ApiResponse({
    status: 200,
    description: 'Le conversation a été trouvé.',
    type: Conversation,
  })
  @ApiResponse({ status: 404, description: 'Conversation non trouvé' })
  @ApiParam({ name: 'id', description: 'ID de la conversation' })
  async getConversation(@Param('id') id: string): Promise<Conversation> {
    return this.conversationService.getConversation(id);
  }
}
