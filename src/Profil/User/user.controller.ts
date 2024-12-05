import {
  Controller,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { User } from './schemas/user.schema';
import { UserService } from './user.service';
import { AuthGuard } from '../../auth/auth-classique/guards/auth.guard';
import { Admin } from '../../auth/common/decorators/isAdmin.decorator';
import { Types } from 'mongoose';
import { UpdateUserDto } from './dtos/update.user';

@ApiTags('User')
@Controller('User')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Public()
  // @Post()
  // @ApiOperation({ summary: "Créer un nouveau profil utilisateur" })
  // @ApiResponse({
  //   status: 201,
  //   description: "Le profil a été créé avec succès.",
  //   type: User,
  // })
  // @ApiBody({ type: CreateUserDto })
  // async create(@Body() createUserDto: CreateUserDto): Promise<User> {
  //   return this.userService.create(createUserDto);
  // }

  @Admin()
  @Get()
  @ApiOperation({ summary: 'Obtenir tous les profils utilisateurs' })
  @ApiResponse({
    status: 200,
    description: 'Liste des profils récupérée avec succès.',
    type: [User],
  })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Admin()
  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un profil utilisateur par ID' })
  @ApiResponse({
    status: 200,
    description: 'Le profil a été trouvé.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Profil non trouvé.' })
  @ApiParam({ name: 'id', description: 'ID du profil utilisateur' })
  async findOne(@Param('id') id: string): Promise<User> {
    const objectId = new Types.ObjectId(id);
    return this.userService.findOne(objectId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un profil utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Le profil a été mis à jour avec succès.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Profil non trouvé.' })
  @ApiParam({ name: 'id', description: 'ID du profil utilisateur' })
  @ApiBody({ type: UpdateUserDto })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const objectId = new Types.ObjectId(id);
    return this.userService.update(objectId, updateUserDto);
  }

  @Admin()
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un profil utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Le profil a été supprimé avec succès.',
  })
  @ApiResponse({ status: 404, description: 'Profil non trouvé.' })
  @ApiParam({ name: 'id', description: 'ID du profil utilisateur' })
  async remove(@Param('id') id: string): Promise<User> {
    return this.userService.remove(id);
  }

  @Admin()
  @Get('search')
  @ApiOperation({ summary: 'Rechercher des profils utilisateurs' })
  @ApiResponse({
    status: 200,
    description: 'Liste des profils correspondants récupérée avec succès.',
    type: [User],
  })
  @ApiQuery({ name: 'query', description: 'Terme de recherche' })
  async search(@Query('query') query: string): Promise<User[]> {
    return this.userService.search(query);
  }
}
