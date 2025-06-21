import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsArray, IsBoolean, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateProfileSuggestionDto {
  @ApiProperty({
    description: 'ID de l\'utilisateur pour lequel on génère la suggestion',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  userId: Types.ObjectId;

  @ApiProperty({
    description: 'ID de l\'utilisateur suggéré',
    example: '507f1f77bcf86cd799439012',
  })
  @IsMongoId()
  suggestedUserId: Types.ObjectId;

  @ApiProperty({
    description: 'Score de compatibilité entre les utilisateurs (0-100)',
    example: 85,
  })
  @IsNumber()
  compatibilityScore: number;

  @ApiProperty({
    description: 'Liste des intérêts communs',
    example: ['musique', 'voyages', 'sport'],
  })
  @IsArray()
  @IsOptional()
  matchingInterests?: string[];

  @ApiProperty({
    description: 'Distance entre les utilisateurs en kilomètres',
    example: 5.2,
  })
  @IsNumber()
  @IsOptional()
  distance?: number;

  @ApiProperty({
    description: 'Indique si la suggestion a été vue',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isViewed?: boolean;
}

export class UpdateProfileSuggestionDto {
  @ApiProperty({
    description: 'Score de compatibilité entre les utilisateurs (0-100)',
    example: 85,
  })
  @IsNumber()
  @IsOptional()
  compatibilityScore?: number;

  @ApiProperty({
    description: 'Indique si la suggestion a été vue',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isViewed?: boolean;
}

export class GetProfileSuggestionsFilterDto {
  @ApiProperty({
    description: 'Score minimum de compatibilité',
    example: 70,
  })
  @IsNumber()
  @IsOptional()
  minCompatibilityScore?: number;

  @ApiProperty({
    description: 'Distance maximale en kilomètres',
    example: 10,
  })
  @IsNumber()
  @IsOptional()
  maxDistance?: number;

  @ApiProperty({
    description: 'Filtre pour afficher uniquement les suggestions non vues',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  notViewed?: boolean;
} 