import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  NotFoundException,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { EnhancedMessageService } from '../message.enhanced.service';
import { Message } from '../schemas/message.schemas';
import { CreateMessageDTO } from '../dtos/create.message';
import { UpdateMessageDTO } from '../dtos/update.message';
import { AuthGuard } from 'src/auth/auth-classique/guards/auth.guard';

@ApiTags('messages-realtime')
@Controller('messages-realtime')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class EnhancedMessageController {
  constructor(private readonly messageService: EnhancedMessageService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau message avec notification en temps réel' })
  @ApiResponse({ status: 201, type: Message })
  @ApiBody({ type: CreateMessageDTO })
  async create(@Body() createMessageDto: CreateMessageDTO): Promise<Message> {
    return this.messageService.create(createMessageDto);
  }

  @Get('conversation/:conversationId')
  @ApiOperation({ summary: 'Obtenir tous les messages d\'une conversation' })
  @ApiResponse({ status: 200, type: [Message] })
  @ApiParam({ name: 'conversationId', description: 'ID de la conversation' })
  async getByConversation(@Param('conversationId') conversationId: string): Promise<Message[]> {
    return this.messageService.findByConversation(conversationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un message par ID' })
  @ApiResponse({ status: 200, type: Message })
  @ApiParam({ name: 'id', description: 'ID du message' })
  async getOne(@Param('id') id: string): Promise<Message> {
    const message = await this.messageService.findOne(id);
    if (!message) {
      throw new NotFoundException('Message non trouvé');
    }
    return message;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un message avec notification en temps réel' })
  @ApiResponse({ status: 200, type: Message })
  @ApiParam({ name: 'id', description: 'ID du message' })
  @ApiBody({ type: UpdateMessageDTO })
  async update(
    @Param('id') id: string,
    @Body() updateMessageDto: UpdateMessageDTO,
  ): Promise<Message> {
    const updated = await this.messageService.update(id, updateMessageDto);
    if (!updated) {
      throw new NotFoundException('Message non trouvé');
    }
    return updated;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un message avec notification en temps réel' })
  @ApiResponse({ status: 204, description: 'Message supprimé avec succès' })
  @ApiParam({ name: 'id', description: 'ID du message' })
  async remove(@Param('id') id: string): Promise<void> {
    const result = await this.messageService.remove(id);
    if (!result) {
      throw new NotFoundException('Message non trouvé');
    }
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Marquer un message comme lu' })
  @ApiResponse({ status: 200, type: Message })
  @ApiParam({ name: 'id', description: 'ID du message' })
  @ApiQuery({ name: 'userId', description: 'ID de l\'utilisateur qui marque le message comme lu' })
  async markAsRead(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ): Promise<Message> {
    return this.messageService.markAsRead(id, userId);
  }

  @Post('typing-status')
  @ApiOperation({ summary: 'Envoyer un statut de frappe' })
  @ApiResponse({ status: 204, description: 'Statut envoyé avec succès' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        conversationId: { type: 'string' },
        userId: { type: 'string' },
        isTyping: { type: 'boolean' },
      },
    },
  })
  async sendTypingStatus(
    @Body('conversationId') conversationId: string,
    @Body('userId') userId: string,
    @Body('isTyping') isTyping: boolean,
  ): Promise<void> {
    await this.messageService.sendTypingStatus(conversationId, userId, isTyping);
  }
} 