import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

class DistanceDto {
  @IsNumber()
  @Min(0)
  min: number;

  @IsNumber()
  @Max(1000)
  max: number;
}

class AgeDto {
  @IsNumber()
  @Min(18)
  min: number;

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

export class UpdateMatchPreferenceDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  genderPreference: string[];

  @ValidateNested()
  @Type(() => AgeDto)
  ageRange: AgeDto;

  @ValidateNested()
  @Type(() => DistanceDto)
  distanceRange: DistanceDto;

  @ValidateNested()
  @Type(() => HeightDto)
  heightRange: HeightDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  bodyTypePreference?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  educationLevelPreference?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relationshipStatusPreference?: string[];

  @IsOptional()
  @IsString()
  smokingPreference?: string;

  @IsOptional()
  @IsString()
  drinkingPreference?: string;

  @IsOptional()
  @IsString()
  childrenPreference?: string;

  @IsOptional()
  @IsString()
  petsPreference?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  religionPreference?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ethnicityPreference?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languagePreference?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interestsPreference?: string[];
}
