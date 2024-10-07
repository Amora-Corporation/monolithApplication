import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from "mongoose";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from "./dtos/create.user";
import { User, UserDocument } from "./schemas/user.schema";


@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  @ApiOperation({ summary: 'Créer un nouveau profil utilisateur' })
  @ApiResponse({
    status: 201,
    description: 'Le profil a été créé avec succès.',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  async create(createUserDto: CreateUserDto): Promise<User> {
    console.log(createUserDto)
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
    
  }

  @ApiOperation({ summary: 'Obtenir tous les profils utilisateurs' })
  @ApiResponse({
    status: 200,
    description: 'Liste des profils récupérée avec succès.',
    type: [User],
  })
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  @ApiOperation({ summary: 'Obtenir un profil utilisateur par ID' })
  @ApiResponse({
    status: 200,
    description: 'Le profil a été trouvé.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Profil non trouvé.' })
  async findOne(id: Types.ObjectId): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`Profil avec l'ID ${id} non trouvé`);
    }
    return user;
  }

  //   @ApiOperation({ summary: 'Mettre à jour un profil utilisateur' })
  //   @ApiResponse({ status: 200, description: 'Le profil a été mis à jour avec succès.', type: User })
  //   @ApiResponse({ status: 404, description: 'Profil non trouvé.' })
  //   async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
  //     const updatedUser = await this.userModel
  //       .findByIdAndUpdate(id, updateUserDto, { new: true })
  //       .exec();
  //     if (!updatedUser) {
  //       throw new NotFoundException(`Profil avec l'ID ${id} non trouvé`);
  //     }
  //     return updatedUser;
  //   }

  @ApiOperation({ summary: 'Supprimer un profil utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Le profil a été supprimé avec succès.',
  })
  @ApiResponse({ status: 404, description: 'Profil non trouvé.' })
  async remove(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`Profil avec l'ID ${id} non trouvé`);
    }
    return deletedUser;
  }

  @ApiOperation({ summary: 'Rechercher des profils utilisateurs' })
  @ApiResponse({
    status: 200,
    description: 'Liste des profils correspondants récupérée avec succès.',
    type: [User],
  })
  async search(query: string): Promise<User[]> {
    return this.userModel
      .find({
        $or: [
          { first_name: { $regex: query, $options: 'i' } },
          { last_name: { $regex: query, $options: 'i' } },
          { nickname: { $regex: query, $options: 'i' } },
        ],
      })
      .exec();
  }
}
