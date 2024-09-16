import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query, UseGuards
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery, ApiBearerAuth
} from "@nestjs/swagger";


import { User } from "./schemas/user.schema";
import { CreateUserDto } from "./dtos/create.user";
import { UserService } from "./user.service";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { Admin } from "../../auth/decorators/isAdmin.decorator";
import { Public } from "../../auth/decorators/public.decorator";

@ApiTags("User")
@Controller("User")
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: "Créer un nouveau profil utilisateur" })
  @ApiResponse({
    status: 201,
    description: "Le profil a été créé avec succès.",
    type: User,
  })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }



  @Admin()
  @Get()
  @ApiOperation({ summary: "Obtenir tous les profils utilisateurs" })
  @ApiResponse({
    status: 200,
    description: "Liste des profils récupérée avec succès.",
    type: [User],
  })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }



  @Get(":id")

  @ApiOperation({ summary: "Obtenir un profil utilisateur par ID" })
  @ApiResponse({
    status: 200,
    description: "Le profil a été trouvé.",
    type: User,
  })
  @ApiResponse({ status: 404, description: "Profil non trouvé." })
  @ApiParam({ name: "id", description: "ID du profil utilisateur" })
  async findOne(@Param("id") id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  //   @Put(':id')
  //   @ApiOperation({ summary: 'Mettre à jour un profil utilisateur' })
  //   @ApiResponse({ status: 200, description: 'Le profil a été mis à jour avec succès.', type: User })
  //   @ApiResponse({ status: 404, description: 'Profil non trouvé.' })
  //   @ApiParam({ name: 'id', description: 'ID du profil utilisateur' })
  //   @ApiBody({ type: UpdateUserDto })
  //   async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
  //     return this.profilService.update(id, updateUserDto);
  //   }


  @Delete(":id")
  @ApiOperation({ summary: "Supprimer un profil utilisateur" })
  @ApiResponse({
    status: 200,
    description: "Le profil a été supprimé avec succès.",
  })
  @ApiResponse({ status: 404, description: "Profil non trouvé." })
  @ApiParam({ name: "id", description: "ID du profil utilisateur" })
  async remove(@Param("id") id: string): Promise<User> {
    return this.userService.remove(id);
  }

  @Get("search")
  @ApiOperation({ summary: "Rechercher des profils utilisateurs" })
  @ApiResponse({
    status: 200,
    description: "Liste des profils correspondants récupérée avec succès.",
    type: [User],
  })
  @ApiQuery({ name: "query", description: "Terme de recherche" })
  async search(@Query("query") query: string): Promise<User[]> {
    return this.userService.search(query);
  }


}
