import { PartialType } from '@nestjs/swagger';
import { CreateAuthsocialMediaDto } from './create-authsocial-media.dto';

export class UpdateAuthsocialMediaDto extends PartialType(CreateAuthsocialMediaDto) {}
