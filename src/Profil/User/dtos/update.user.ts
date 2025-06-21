import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create.user';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
