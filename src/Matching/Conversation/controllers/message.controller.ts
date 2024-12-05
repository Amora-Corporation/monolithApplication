import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { MessageService } from '../message.service';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { Message } from '../schemas/message.schemas';
import { CreateMessageDTO } from '../dtos/create.message';
import { UpdateMessageDTO } from '../dtos/update.message';

@ApiTags('messaging')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau message' })
  @ApiResponse({
    status: 201,
    description: 'Le message a été créé avec succès',
    type: Message,
  })
  @ApiBody({ type: CreateMessageDTO })
  async create(@Body() createMessageDTO: CreateMessageDTO): Promise<Message> {
    return this.messageService.create(createMessageDTO);
  }

  @Get()
  @ApiOperation({ summary: 'Obtenir tous les messages' })
  @ApiResponse({
    status: 200,
    description: 'Liste de tous les messages',
    type: [Message],
  })
  async findAll(): Promise<Message[]> {
    return this.messageService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un message par ID' })
  @ApiResponse({
    status: 200,
    description: 'Le message a été trouvé',
    type: Message,
  })
  @ApiParam({ name: 'id', type: 'string' })
  async findOne(@Param('id') id: string): Promise<Message> {
    const message = await this.messageService.findOne(id);
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return message;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un message' })
  @ApiResponse({
    status: 200,
    description: 'Le message a été mis à jour avec succès',
    type: Message,
  })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ type: UpdateMessageDTO })
  async update(
    @Param('id') id: string,
    @Body() updateMessageDTO: UpdateMessageDTO,
  ): Promise<Message> {
    const updatedMessage = await this.messageService.update(
      id,
      updateMessageDTO,
    );
    if (!updatedMessage) {
      throw new NotFoundException('Message not found');
    }
    return updatedMessage;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un message' })
  @ApiResponse({
    status: 204,
    description: 'Le message a été supprimé avec succès',
  })
  @ApiParam({ name: 'id', type: 'string' })
  async remove(@Param('id') id: string): Promise<void> {
    const result = await this.messageService.remove(id);
    if (!result) {
      throw new NotFoundException('Message not found');
    }
  }
}
