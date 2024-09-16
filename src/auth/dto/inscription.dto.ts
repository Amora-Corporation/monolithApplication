import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsOptional } from "class-validator";

export class InscriptionDto {
  @ApiProperty({
    example: 'user@example.com',
    description: "L'adresse email de l'utilisateur",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @ApiProperty({
    example: 'password123',
    description: "Le mot de passe de l'utilisateur",
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}