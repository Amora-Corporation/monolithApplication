import {
  Controller,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Put,
  Req,
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
import { JwtService } from '@nestjs/jwt';
import { Public } from 'src/auth/common/decorators/public.decorator';
import { CurrentUser } from 'src/auth/common/decorators/currentUser.decorator';
import { TokenDto } from 'src/auth/common/dto/token.dto';

@ApiTags('User')
@Controller('User')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  
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
  async findAll(@Query('page') page: number, @Query('limit') limit: number): Promise<User[]> {
    return this.userService.findAll(page, limit);
  }

  @Get('me')
  @ApiOperation({ summary: 'Obtenir le profil de l\'utilisateur connecté' })
  @ApiResponse({
    status: 200,
    description: 'Profil de l\'utilisateur connecté récupéré avec succès.',
    type: User,

  })
  async me(@CurrentUser() user: TokenDto): Promise<User> {
    return this.userService.findOne(new Types.ObjectId(user._id));
  }

  @Public()
  @Get('search')
  @ApiOperation({ summary: 'Rechercher des profils utilisateurs' })
  @ApiResponse({
    status: 200,
    description: 'Liste des profils correspondants récupérée avec succès.',
    type: [User],
  })
  @ApiQuery({ name: 'query', description: 'Terme de recherche' })
  async search(@Query('query') query: string , @Query('page') page: number, @Query('limit') limit: number): Promise<User[]> {
    return this.userService.search(query, page, limit);
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

  @Put()
  @ApiOperation({ summary: 'Mettre à jour un profil utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Le profil a été mis à jour avec succès.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Profil non trouvé.' })
  @ApiBody({ type: UpdateUserDto })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async update(
    @CurrentUser() user: { _id: string },
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    // console.log("user ", user)
    return this.userService.update(user._id, updateUserDto);
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
}
