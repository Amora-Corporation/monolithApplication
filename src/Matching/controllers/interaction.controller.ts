import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { InteractionService } from '../interaction.service';
import { Interaction } from '../schemas/Interaction.schemas';
import { CreateInteractionDto } from '../dtos/Interaction.create';
import { UpdateInteractionDto } from '../dtos/Interaction.update';
import { AuthGuard } from 'src/auth/auth-classique/guards/auth.guard';
import { CurrentUser } from 'src/auth/common/decorators/currentUser.decorator';
import { TokenDto } from 'src/auth/common/dto/token.dto';
import { Admin } from 'src/auth/common/decorators/isAdmin.decorator';

@ApiTags('matching')
@Controller('Interaction')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  @Post()
  @ApiOperation({ summary: 'Envoyer un like' })
  @ApiResponse({ status: 201, type: Interaction })
  @ApiBody({ type: CreateInteractionDto })
  async createLike(
    @CurrentUser() user: TokenDto,
    @Body() createLikeDto: CreateInteractionDto,
  ): Promise<Interaction> {
    return this.interactionService.createInteration(createLikeDto, user);
  }

  @Get()
  @Admin()
  @ApiOperation({ summary: 'Obtenir toutes les interactions' })
  @ApiResponse({ status: 200, type: [Interaction] })
  async getAllInteractions(): Promise<Interaction[]> {
    return this.interactionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une interaction par ID' })
  @ApiResponse({ status: 200, type: Interaction })
  @ApiParam({ name: 'id', type: 'string' })
  async getInteraction(@Param('id') id: string): Promise<Interaction> {
    const interaction = await this.interactionService.findOne(id);
    if (!interaction) {
      throw new NotFoundException('Interaction not found');
    }
    return interaction;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une interaction' })
  @ApiResponse({ status: 200, type: Interaction })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ type: UpdateInteractionDto })
  async updateInteraction(
    @Param('id') id: string,
    @Body() updateInteractionDto: UpdateInteractionDto,
  ): Promise<Interaction> {
    const updatedInteraction = await this.interactionService.update(
      id,
      updateInteractionDto,
    );
    if (!updatedInteraction) {
      throw new NotFoundException('Interaction not found');
    }
    return updatedInteraction;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une interaction' })
  @ApiResponse({
    status: 204,
    description: 'Interaction supprimée avec succès',
  })
  @ApiParam({ name: 'id', type: 'string' })
  async deleteInteraction(@Param('id') id: string): Promise<void> {
    const result = await this.interactionService.remove(id);
    if (!result) {
      throw new NotFoundException('Interaction not found');
    }
  }
}
