import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString, IsEnum, IsOptional, IsObject, IsBoolean, IsNumber, IsUrl } from 'class-validator';
import { Types } from 'mongoose';

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  FILE = 'file',
  LOCATION = 'location',
}

export class MediaInfoDto {
  @ApiProperty({
    description: 'URL du média',
    example: 'https://example.com/media/image.jpg',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  url?: string;

  @ApiProperty({
    description: 'URL de la vignette du média',
    example: 'https://example.com/media/thumbnail.jpg',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  thumbnailUrl?: string;

  @ApiProperty({
    description: 'Type MIME du média',
    example: 'image/jpeg',
    required: false,
  })
  @IsString()
  @IsOptional()
  mimeType?: string;

  @ApiProperty({
    description: 'Nom du fichier',
    example: 'photo.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  fileName?: string;

  @ApiProperty({
    description: 'Taille du fichier en octets',
    example: 1024,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  fileSize?: number;

  @ApiProperty({
    description: 'Durée en secondes pour les fichiers audio/vidéo',
    example: 120,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  duration?: number;

  @ApiProperty({
    description: 'Largeur de l\'image ou de la vidéo',
    example: 1280,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  width?: number;

  @ApiProperty({
    description: 'Hauteur de l\'image ou de la vidéo',
    example: 720,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  height?: number;

  @ApiProperty({
    description: 'Latitude pour les messages de type localisation',
    example: 48.8566,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    description: 'Longitude pour les messages de type localisation',
    example: 2.3522,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  longitude?: number;
}

export class CreateEnhancedMessageDto {
  @ApiProperty({
    description: 'ID de la conversation',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  conversationId: Types.ObjectId;

  @ApiProperty({
    description: 'ID de l\'expéditeur',
    example: '507f1f77bcf86cd799439022',
  })
  @IsMongoId()
  senderId: Types.ObjectId;

  @ApiProperty({
    description: 'Contenu du message',
    example: 'Bonjour, comment ça va ?',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Type de message',
    enum: MessageType,
    default: MessageType.TEXT,
  })
  @IsEnum(MessageType)
  @IsOptional()
  messageType?: MessageType;

  @ApiProperty({
    description: 'Informations sur le média',
    type: MediaInfoDto,
    required: false,
  })
  @IsObject()
  @IsOptional()
  mediaInfo?: MediaInfoDto;
}

export class UpdateEnhancedMessageDto {
  @ApiProperty({
    description: 'Contenu du message',
    example: 'Message modifié',
    required: false,
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({
    description: 'Indique si le message a été modifié',
    example: true,
    default: true,
  })
  @IsBoolean()
  isEdited: boolean = true;

  @ApiProperty({
    description: 'Date de modification',
    example: new Date(),
  })
  editedAt: Date = new Date();
}

export class ReadReceiptDto {
  @ApiProperty({
    description: 'ID de l\'utilisateur qui a lu le message',
    example: '507f1f77bcf86cd799439033',
  })
  @IsMongoId()
  userId: Types.ObjectId;
}

export class MessageStatusDto {
  @ApiProperty({
    description: 'Indique si l\'utilisateur est en train de taper',
    example: true,
  })
  @IsBoolean()
  isTyping: boolean;

  @ApiProperty({
    description: 'ID de l\'utilisateur',
    example: '507f1f77bcf86cd799439044',
  })
  @IsMongoId()
  userId: Types.ObjectId;

  @ApiProperty({
    description: 'ID de la conversation',
    example: '507f1f77bcf86cd799439055',
  })
  @IsMongoId()
  conversationId: Types.ObjectId;
} 