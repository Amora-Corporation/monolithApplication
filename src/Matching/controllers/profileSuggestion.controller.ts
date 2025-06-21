import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProfileSuggestionService } from '../profileSuggestion.service';
import { ProfileSuggestion } from '../schemas/profileSuggestion.schema';
import {
  CreateProfileSuggestionDto,
  UpdateProfileSuggestionDto,
  GetProfileSuggestionsFilterDto,
} from '../dtos/profileSuggestion.dto';
import { AuthGuard } from 'src/auth/auth-classique/guards/auth.guard';
import { CurrentUser } from 'src/auth/common/decorators/currentUser.decorator';
import { TokenDto } from 'src/auth/common/dto/token.dto';
import { User } from 'src/Profil/User/schemas/user.schema';
@ApiTags('profile-suggestions')
@Controller('profile-suggestions')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ProfileSuggestionController {
  constructor(private readonly profileSuggestionService: ProfileSuggestionService) {}

  @Get()
  @ApiOperation({ summary: 'Obtenir des suggestions de profils pour un utilisateur' })
  @ApiResponse({ status: 200, type: [ProfileSuggestion] })
  async getProfileSuggestions(
    @CurrentUser() user: TokenDto
  ): Promise<User[]> {
    console.log("user", user)
    return this.profileSuggestionService.getProfileSuggestions(user);
  }

  @Get('generate/:userId')
  @ApiOperation({ summary: 'Générer des suggestions de profils pour un utilisateur' })
  @ApiResponse({ status: 200, type: [ProfileSuggestion] })
  @ApiParam({ name: 'userId', description: 'ID de l\'utilisateur' })
  async generateSuggestionsForUser(@Param('userId') userId: string): Promise<ProfileSuggestion[]> {
    return this.profileSuggestionService.generateSuggestionsForUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une suggestion de profil par ID' })
  @ApiResponse({ status: 200, type: ProfileSuggestion })
  @ApiParam({ name: 'id', description: 'ID de la suggestion' })
  async getSuggestionById(@Param('id') id: string): Promise<ProfileSuggestion> {
    const suggestion = await this.profileSuggestionService.getSuggestionById(id);
    if (!suggestion) {
      throw new NotFoundException('Suggestion not found');
    }
    return suggestion;
  }

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle suggestion de profil' })
  @ApiResponse({ status: 201, type: ProfileSuggestion })
  async createProfileSuggestion(
    @Body() createProfileSuggestionDto: CreateProfileSuggestionDto,
  ): Promise<ProfileSuggestion> {
    return this.profileSuggestionService.createProfileSuggestion(createProfileSuggestionDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une suggestion de profil' })
  @ApiResponse({ status: 200, type: ProfileSuggestion })
  @ApiParam({ name: 'id', description: 'ID de la suggestion' })
  async updateSuggestion(
    @Param('id') id: string,
    @Body() updateProfileSuggestionDto: UpdateProfileSuggestionDto,
  ): Promise<ProfileSuggestion> {
    const updatedSuggestion = await this.profileSuggestionService.updateSuggestion(
      id,
      updateProfileSuggestionDto,
    );
    if (!updatedSuggestion) {
      throw new NotFoundException('Suggestion not found');
    }
    return updatedSuggestion;
  }

  @Put(':id/view')
  @ApiOperation({ summary: 'Marquer une suggestion comme vue' })
  @ApiResponse({ status: 200, type: ProfileSuggestion })
  @ApiParam({ name: 'id', description: 'ID de la suggestion' })
  async markSuggestionAsViewed(@Param('id') id: string): Promise<ProfileSuggestion> {
    const updatedSuggestion = await this.profileSuggestionService.markSuggestionAsViewed(id);
    if (!updatedSuggestion) {
      throw new NotFoundException('Suggestion not found');
    }
    return updatedSuggestion;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une suggestion de profil' })
  @ApiResponse({ status: 204, description: 'Suggestion supprimée avec succès' })
  @ApiParam({ name: 'id', description: 'ID de la suggestion' })
  async deleteSuggestion(@Param('id') id: string): Promise<void> {
    const result = await this.profileSuggestionService.deleteSuggestion(id);
    if (!result) {
      throw new NotFoundException('Suggestion not found');
    }
  }
} 