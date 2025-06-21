import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Gender } from './schemas/gender.schemas';
import { GenderService } from './gender.service';
import { CreateGerderDTO } from './dtos/gender.create';
import { UpdateGenderDTO } from './dtos/gender.update';
import { AuthGuard } from 'src/auth/auth-classique/guards/auth.guard';
import { Public } from 'src/auth/common/decorators/public.decorator';
@ApiTags('gender')
@Controller('gender')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class GenderController {
  constructor(private readonly genderService: GenderService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get genders' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tout les genders',
    type: [Gender], // Utilise un tableau pour représenter plusieurs genres
  })
  async getGenders(): Promise<Gender[]> {
    return this.genderService.getAllGenders();
  }

  @Post()
  @ApiOperation({ summary: 'Post gender' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Post gender',
    type: Gender,
  })
  @ApiBody({ type: CreateGerderDTO })
  @Public()
  async create(@Body() createGenderDto: CreateGerderDTO): Promise<Gender> {
    return this.genderService.createGender(createGenderDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update gender by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update a gender',
    type: Gender,
  })
  @ApiBody({ type: UpdateGenderDTO })
  async update(
    @Param('id') id: string,
    @Body() updateGenderDto: UpdateGenderDTO,
  ): Promise<Gender> {
    return this.genderService.updateGender(id, updateGenderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete gender by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete a gender',
    type: Gender,
  })
  async delete(@Param('id') id: string): Promise<Gender> {
    return this.genderService.deleteGender(id);
  }
}
