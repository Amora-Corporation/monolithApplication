import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ApiOperation, ApiResponse } from '@nestjs/swagger'; // Vérifiez si le module est installé
import { CreateUserDto } from './dtos/create.user';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './dtos/update.user';
import { Public } from 'src/auth/common/decorators/public.decorator';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}
  @ApiOperation({ summary: 'Créer un nouveau profil utilisateur' })
  @ApiResponse({
    status: 201,
    description: 'Le profil a été créé avec succès.',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  async create(createUserDto: Partial<CreateUserDto>): Promise<User> {
    //console.log(createUserDto)
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  @ApiOperation({ summary: 'Obtenir tous les profils utilisateurs' })
  @ApiResponse({
    status: 200,
    description: 'Liste des profils récupérée avec succès.',
    type: [User],
  })
  async findAll(page: number, limit: number): Promise<User[]> {
    const skip = (page - 1) * limit;
    return this.userModel.find().skip(skip).limit(limit).exec();
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
    // console.log("user", user);
    if (!user) {
      throw new NotFoundException(`Profil avec l'ID ${id} non trouvé`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`Profil avec l'email ${email} non trouvé`);
    }
    return user;
  }

  @ApiOperation({ summary: 'Mettre à jour un profil utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Le profil a été mis à jour avec succès.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Profil non trouvé.' })
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    // console.log("id", id);

    const updatedUser = await this.userModel
      .findByIdAndUpdate(new Types.ObjectId(id), { ...updateUserDto }, { new: true }).exec();

    if (!updatedUser) {
      throw new NotFoundException(`Profil avec l'ID ${id} non trouvé`);
    }

    // Vérification des critères pour déterminer si le compte est vide
    const hasEssentialInfo = 
      updatedUser.first_name && 
      updatedUser.birthdate && 
      updatedUser.gender_ID && 
      updatedUser.photos.length > 0;

    updatedUser.empty_account = !hasEssentialInfo;

    await updatedUser.save();
    return updatedUser;
  }

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
  @Public()
  async search(query: string, page: number, limit: number): Promise<User[]> {
    const skip = (page - 1) * limit;
    return this.userModel
      .find({
        $or: [
          { first_name: { $regex: query, $options: 'i' } },
          { last_name: { $regex: query, $options: 'i' } },
          { nickname: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } }
        ],
      })
      .skip(skip)
      .limit(limit)
      .exec();
  }
}
