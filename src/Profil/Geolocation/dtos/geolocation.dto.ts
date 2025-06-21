import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsString, IsOptional, IsDate } from 'class-validator';
import { Types } from 'mongoose';

export class CreateGeolocationDto {
  

  @ApiProperty({
    description: 'Latitude',
    example: 48.8566,
  })
  @IsNumber()
  latitude: number;

  @ApiProperty({
    description: 'Longitude',
    example: 2.3522,
  })
  @IsNumber()
  longitude: number;

  @ApiProperty({
    description: 'Ville',
    example: 'Paris',
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    description: 'Pays',
    example: 'France',
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({
    description: 'Adresse',
    example: '1 Rue de Rivoli',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'Précision en mètres',
    example: 10,
  })
  @IsNumber()
  @IsOptional()
  accuracy?: number;
}

export class UpdateGeolocationDto {
  @ApiProperty({
    description: 'Latitude',
    example: 48.8566,
  })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    description: 'Longitude',
    example: 2.3522,
  })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({
    description: 'Ville',
    example: 'Paris',
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    description: 'Pays',
    example: 'France',
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({
    description: 'Adresse',
    example: '1 Rue de Rivoli',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'Précision en mètres',
    example: 10,
  })
  @IsNumber()
  @IsOptional()
  accuracy?: number;

  @ApiProperty({
    description: 'Date de dernière mise à jour',
    example: '2023-01-29T12:00:00Z',
  })
  @IsDate()
  @IsOptional()
  lastUpdated?: Date;
}

// export class GetNearbyUsersDto {
//   // @ApiProperty({
//   //   description: 'ID de l\'utilisateur',
//   //   example: '507f1f77bcf86cd799439011',
//   // })
//   // @IsMongoId()
//   // userId: string;

//   @ApiProperty({
//     description: 'Distance maximale en kilomètres',
//     example: 10,
//   })
//   @IsNumber()
//   maxDistance: number;
// } 