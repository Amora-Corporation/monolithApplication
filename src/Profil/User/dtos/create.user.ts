import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  IsDate,
  IsOptional,
  IsEmail,
  MinLength,
  MaxLength,
  Min,
  Max,
  IsObject,
} from 'class-validator';
import { Types } from "mongoose";

export class CreateUserDto {

  @ApiProperty({ example: '', description: "ID" })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  _id: Types.ObjectId;

  @ApiProperty({ example: 'John', description: "Le prénom de l'utilisateur" })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  first_name: string;

  @ApiProperty({
    example: 'Doe',
    description: "Le nom de famille de l'utilisateur",
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  last_name: string;

  @ApiProperty({ example: 1, description: "ID du genre de l'utilisateur" })
  @IsNumber()
  gender_ID: number;

  @ApiProperty({
    example: 'johndoe',
    description: "Le pseudonyme de l'utilisateur",
  })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  nickname: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: "L'adresse email de l'utilisateur",
  })
  @IsEmail()
  email: string;

  // @ApiProperty({
  //   example: 'password123',
  //   description: "Le mot de passe de l'utilisateur",
  // })
  // @IsString()
  // @MinLength(8)
  // password: string;

  @ApiPropertyOptional({
    example: 75,
    description: "La popularité de l'utilisateur",
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  popularity: number;

  @ApiProperty({
    example: '1990-01-01',
    description: "La date de naissance de l'utilisateur",
  })
  @IsDate()
  birthdate: Date;

  @ApiProperty({
    example: 'Paris, France',
    description: "La localisation de l'utilisateur",
  })
  @IsString()
  location: string;

  @ApiPropertyOptional({
    example: ['sports', 'music'],
    description: "Les centres d'intérêt de l'utilisateur",
  })
  @IsArray()
  @IsOptional()
  interests: string[];

  @ApiPropertyOptional({
    example: ['url1', 'url2'],
    description: "Les URLs des photos de l'utilisateur",
  })
  @IsArray()
  @IsOptional()
  photos: string[];

  @ApiPropertyOptional({
    example: { min: 25, max: 35 },
    description: "La tranche d'âge préférée de l'utilisateur",
  })
  @IsObject()
  @IsOptional()
  age_range: { min: number; max: number };

  @ApiPropertyOptional({
    example: 'Bachelor',
    description: "Le niveau d'éducation de l'utilisateur",
  })
  @IsString()
  @IsOptional()
  education: string;

  @ApiPropertyOptional({
    example: 'Engineer',
    description: "La profession de l'utilisateur",
  })
  @IsString()
  @IsOptional()
  occupation: string;

  @ApiPropertyOptional({
    example: 'I love traveling and meeting new people',
    description: "La biographie de l'utilisateur",
  })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  bio: string;

  @ApiPropertyOptional({
    example: ['reading', 'hiking'],
    description: "Les hobbies de l'utilisateur",
  })
  @IsArray()
  @IsOptional()
  hobbies: string[];

  @ApiPropertyOptional({
    example: 'Single',
    description: "Le statut relationnel de l'utilisateur",
  })
  @IsString()
  @IsOptional()
  relationship_status: string;

  @ApiPropertyOptional({
    example: ['English', 'French'],
    description: "Les langues parlées par l'utilisateur",
  })
  @IsArray()
  @IsOptional()
  languages: string[];

  @ApiPropertyOptional({
    example: 180,
    description: "La taille de l'utilisateur en cm",
  })
  @IsNumber()
  @IsOptional()
  height: number;

  @ApiPropertyOptional({
    example: 75,
    description: "Le poids de l'utilisateur en kg",
  })
  @IsNumber()
  @IsOptional()
  weight: number;

  @ApiPropertyOptional({
    example: 'Caucasian',
    description: "L'ethnicité de l'utilisateur",
  })
  @IsString()
  @IsOptional()
  ethnicity: string;

  @ApiPropertyOptional({
    example: 'Agnostic',
    description: "La religion de l'utilisateur",
  })
  @IsString()
  @IsOptional()
  religion: string;

  @ApiPropertyOptional({
    example: [1, 2],
    description: "Les genres qui intéressent l'utilisateur",
  })
  @IsArray()
  @IsOptional()
  interested_genre: number[];

  @ApiPropertyOptional({
    example: true,
    description: "Le statut de vérification de l'utilisateur",
  })
  @IsBoolean()
  @IsOptional()
  verification_status: boolean;

  @ApiPropertyOptional({
    example: { min: 5, max: 50 },
    description: "La plage de distance préférée de l'utilisateur en km",
  })
  @IsObject()
  @IsOptional()
  preferred_distance_range: { min: number; max: number };

  @ApiPropertyOptional({
    example: 'Long-term relationship',
    description: "Ce que l'utilisateur recherche",
  })
  @IsString()
  @IsOptional()
  looking_for: string;

  @ApiPropertyOptional({
    example: 'Gemini',
    description: "Le signe astrologique de l'utilisateur",
  })
  @IsString()
  @IsOptional()
  zodiac_sign: string;

  @ApiPropertyOptional({
    example: 'INTJ',
    description: "Le type de personnalité de l'utilisateur",
  })
  @IsString()
  @IsOptional()
  personality_type: string;

  @ApiPropertyOptional({
    example: false,
    description: "Si l'utilisateur est fumeur",
  })
  @IsBoolean()
  @IsOptional()
  smoker: boolean;

  @ApiPropertyOptional({
    example: 'Social drinker',
    description: "Les habitudes de consommation d'alcool de l'utilisateur",
  })
  @IsString()
  @IsOptional()
  drinker: string;

  @ApiPropertyOptional({
    example: 'No children',
    description: "La situation de l'utilisateur par rapport aux enfants",
  })
  @IsString()
  @IsOptional()
  children: string;

  @ApiPropertyOptional({
    example: ['Dog', 'Cat'],
    description: "Les animaux de compagnie de l'utilisateur",
  })
  @IsArray()
  @IsOptional()
  pets: string[];

  @ApiPropertyOptional({
    example: true,
    description: "Si les photos de l'utilisateur sont vérifiées",
  })
  @IsBoolean()
  @IsOptional()
  verified_photos: boolean;

  @ApiPropertyOptional({
    example: { instagram: 'johndoe', linkedin: 'john-doe' },
    description: "Les liens vers les réseaux sociaux de l'utilisateur",
  })
  @IsObject()
  @IsOptional()
  social_media_links: { [key: string]: string };

  @ApiPropertyOptional({
    example: ['Texting', 'Phone calls'],
    description: "Les styles de communication préférés de l'utilisateur",
  })
  @IsArray()
  @IsOptional()
  preferred_communication_style: string[];

  @ApiPropertyOptional({
    example: ['Smoking', 'Dishonesty'],
    description: "Les deal-breakers de l'utilisateur",
  })
  @IsArray()
  @IsOptional()
  deal_breakers: string[];

  @ApiPropertyOptional({
    example: 'Fully vaccinated',
    description: "Le statut de vaccination de l'utilisateur",
  })
  @IsString()
  @IsOptional()
  vaccination_status: string;

  @ApiPropertyOptional({
    example: 'Moderate',
    description: "Les opinions politiques de l'utilisateur",
  })
  @IsString()
  @IsOptional()
  political_views: string;

  @ApiPropertyOptional({
    example: ['Rock', 'Jazz'],
    description: "Les genres musicaux préférés de l'utilisateur",
  })
  @IsArray()
  @IsOptional()
  favorite_music: string[];

  @ApiPropertyOptional({
    example: ['Inception', 'The Godfather'],
    description: "Les films préférés de l'utilisateur",
  })
  @IsArray()
  @IsOptional()
  favorite_movies: string[];

  @ApiPropertyOptional({
    example: ['Breaking Bad', 'Game of Thrones'],
    description: "Les séries TV préférées de l'utilisateur",
  })
  @IsArray()
  @IsOptional()
  favorite_tv_shows: string[];

  @ApiPropertyOptional({
    example: 'Once a year',
    description: "La fréquence de voyage de l'utilisateur",
  })
  @IsString()
  @IsOptional()
  travel_frequency: string;

  @ApiPropertyOptional({
    example: 'Work hard, play hard',
    description: "L'équilibre travail-vie personnelle de l'utilisateur",
  })
  @IsString()
  @IsOptional()
  work_life_balance: string;

  @ApiPropertyOptional({
    example: '3 times a week',
    description: "La fréquence d'exercice de l'utilisateur",
  })
  @IsString()
  @IsOptional()
  exercise_frequency: string;

  @ApiPropertyOptional({
    example: ['Vegetarian', 'Gluten-free'],
    description: "Les préférences alimentaires de l'utilisateur",
  })
  @IsArray()
  @IsOptional()
  dietary_preferences: string[];

  @ApiPropertyOptional({
    example: 'Bali',
    description: "La destination de vacances de rêve de l'utilisateur",
  })
  @IsString()
  @IsOptional()
  dream_vacation: string;
}
