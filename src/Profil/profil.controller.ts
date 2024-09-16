import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from "@nestjs/common";
import { ProfilService } from "./profil.service";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from "@nestjs/swagger";
import { CreateUserDto } from "./dtos/create.profil";
import { User } from "./schemas/profil.schema";
import { MessagePattern, Payload } from "@nestjs/microservices";

@ApiTags("Profils")
@Controller("profils")
export class ProfilController {
  constructor(private readonly profilService: ProfilService) {}

  @Post()
  @ApiOperation({ summary: "Créer un nouveau profil utilisateur" })
  @ApiResponse({
    status: 201,
    description: "Le profil a été créé avec succès.",
    type: User,
  })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.profilService.create(createUserDto);
  }


  @MessagePattern('CreateUser')
  async createUserFromMessage(@Payload() data: CreateUserDto): Promise<any> {

    try {
      const user = await this.profilService.create(data);
      return { success: true, user };
    } catch (error) {
      console.log(error)
      return { success: false, error: error.message };
    }
  }

  async hello(data:string) {
    console.log(data);
  }



  @Get()
  @ApiOperation({ summary: "Obtenir tous les profils utilisateurs" })
  @ApiResponse({
    status: 200,
    description: "Liste des profils récupérée avec succès.",
    type: [User],
  })
  async findAll(): Promise<User[]> {
    return this.profilService.findAll();
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
    return this.profilService.findOne(id);
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
    return this.profilService.remove(id);
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
    return this.profilService.search(query);
  }
}
