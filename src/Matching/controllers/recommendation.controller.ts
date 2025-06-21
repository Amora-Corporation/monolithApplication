import {
  Controller,
  Get,
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
} from '@nestjs/swagger';
import { RecommendationService } from '../recommendation.service';
import { ProfileSuggestion } from '../schemas/profileSuggestion.schema';
import { AuthGuard } from 'src/auth/auth-classique/guards/auth.guard';

@ApiTags('recommendations')
@Controller('recommendations')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  // @Get('user/:userId')
  // @ApiOperation({ summary: 'Générer des recommandations personnalisées pour un utilisateur' })
  // @ApiResponse({ status: 200, type: [ProfileSuggestion] })
  // @ApiParam({ name: 'userId', description: 'ID de l\'utilisateur' })
  // @ApiQuery({ name: 'limit', required: false, description: 'Nombre maximum de recommandations à retourner' })
  // async getRecommendationsForUser(
  //   @Param('userId') userId: string,
  //   @Query('limit') limit?: number,
  // ): Promise<ProfileSuggestion[]> {
  //   const recommendations = await this.recommendationService.generateRecommendations(userId);
    
  //   if (!recommendations || recommendations.length === 0) {
  //     throw new NotFoundException('Aucune recommandation trouvée pour cet utilisateur');
  //   }
    
  //   // Limiter le nombre de résultats si demandé
  //   if (limit && !isNaN(Number(limit))) {
  //     return recommendations.slice(0, Number(limit));
  //   }
    
  //   return recommendations;
  // }
} 