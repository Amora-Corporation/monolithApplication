import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  Min,
  Max,
  ArrayNotEmpty,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
class DistanceDto {
  @ApiProperty({ example: 0, minimum: 0 })
  @IsNumber()
  @Min(0)
  min: number;

  @ApiProperty({ example: 50, maximum: 1000 })
  @IsNumber()
  @Max(1000)
  max: number;
}

class AgeDto {
  @ApiProperty({ example: 25, minimum: 18 })
  @IsNumber()
  @Min(18)
  min: number;

  @ApiProperty({ example: 35, maximum: 99 })
  @IsNumber()
  @Max(99)
  max: number;
}

class HeightDto {
  @IsNumber()
  @Min(100)
  min: number;

  @IsNumber()
  @Max(250)
  max: number;
}

export class CreateMatchPreferenceDto {
  @ApiProperty({
    type: [String],
    description: 'Liste des IDs des genres préférés',
    example: ['6838cbd4fee6f70387c45063'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  genderPreference: string[];

  @ApiProperty({ type: () => AgeDto, description: 'Plage d\'âge préférée' })
  @ValidateNested()
  @Type(() => AgeDto)
  ageRange: AgeDto;

  @ApiProperty({ type: () => DistanceDto, description: 'Plage de distance préférée' })
  @ValidateNested()
  @Type(() => DistanceDto)
  distanceRange: DistanceDto;

  @ApiProperty({
    type: [String],
    required: false,
    description: 'Liste d\'intérêts préférés',
    example: ['sport', 'cinéma', 'voyages'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interestsPreference?: string[];
  // @ValidateNested()
  // @Type(() => HeightDto)
  // heightRange: HeightDto;

  // @IsOptional()
  // @IsArray()
  // @IsString({ each: true })
  // bodyTypePreference?: string[];

  // @IsOptional()
  // @IsArray()
  // @IsString({ each: true })
  // educationLevelPreference?: string[];

  // @IsOptional()
  // @IsArray()
  // @IsString({ each: true })
  // relationshipStatusPreference?: string[];

  // @IsOptional()
  // @IsString()
  // smokingPreference?: string;

  // @IsOptional()
  // @IsString()
  // drinkingPreference?: string;

  // @IsOptional()
  // @IsString()
  // childrenPreference?: string;

  // @IsOptional()
  // @IsString()
  // petsPreference?: string;

  // @IsOptional()
  // @IsArray()
  // @IsString({ each: true })
  // religionPreference?: string[];

  // @IsOptional()
  // @IsArray()
  // @IsString({ each: true })
  // ethnicityPreference?: string[];

  // @IsOptional()
  // @IsArray()
  // @IsString({ each: true })
  // languagePreference?: string[];

 
}
