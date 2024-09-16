import { IsNotEmpty, IsString, IsDate, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePhotoDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsNotEmpty()
  @IsString()
  link: string;

  @IsNotEmpty()
  @IsString()
  details: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dateAdding: Date;
}
