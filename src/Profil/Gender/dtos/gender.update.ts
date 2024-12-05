import { IsString } from 'class-validator';

export class UpdateGenderDTO {
  @IsString()
  name: string;
}
