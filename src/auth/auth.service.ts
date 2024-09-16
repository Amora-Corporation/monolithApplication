import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Auth, AuthDocument } from "./schemas/auth.schema";
import { Model, Schema, Types } from "mongoose";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ClientProxy, MessagePattern } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,

    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject('TOKEN_SERVICE') private readonly client: ClientProxy
  ) {
  }

  async signUp(createAuthDto: CreateAuthDto): Promise<any> {
    const userExists = await this.authModel.findOne({
      email: createAuthDto.email
    });

    if (userExists) {
      throw new BadRequestException("User already exists");
    }

    const hashedPassword = await this.hashData(createAuthDto.password);
    const createdAuth = new this.authModel({
      ...createAuthDto,
      password: hashedPassword
    });

    await createdAuth.save();

    const tokens = await this.getTokens(createdAuth._id, createdAuth.email);
    await this.updateRefreshToken(createdAuth._id, tokens.refreshToken);

    try {
      // Envoyer un message et attendre la réponse
      const response = await firstValueFrom(
        this.client.send('CreateUser', {
          id: createdAuth._id,
          email: createdAuth.email
        })
      );

      if (response.error) {
        console.log(response.error)
        await this.authModel.findByIdAndDelete(createdAuth._id);
        throw new BadRequestException(response.error);
      }

      return tokens;
    } catch (error) {
      // En cas d'erreur de communication, supprimer l'utilisateur créé
      await this.authModel.findByIdAndDelete(createdAuth._id);
      throw new BadRequestException('Failed to create user account');
    }
  }

  async findAll(): Promise<Auth[]> {
    return this.authModel.find().exec();
  }

  async findOne(id: string): Promise<Auth> {
    const auth = await this.authModel.findById(id).exec();
    if (!auth) {
      throw new NotFoundException(`Auth with ID "${id}" not found`);
    }
    return auth;
  }

  async update(id: string, updateAuthDto: UpdateAuthDto): Promise<Auth> {
    if (updateAuthDto.password) {
      updateAuthDto.password = await bcrypt.hash(updateAuthDto.password, 10);
    }
    const updatedAuth = await this.authModel.findByIdAndUpdate(id, updateAuthDto, { new: true }).exec();
    if (!updatedAuth) {
      throw new NotFoundException(`Auth with ID "${id}" not found`);
    }
    return updatedAuth;
  }

  async remove(id: string): Promise<Auth> {
    const deletedAuth = await this.authModel.findByIdAndDelete(id).exec();
    if (!deletedAuth) {
      throw new NotFoundException(`Auth with ID "${id}" not found`);
    }
    return deletedAuth;
  }

  async findByEmail(email: string): Promise<Auth> {
    const auth = await this.authModel.findOne({ email: email }).exec();
    if (!auth) {
      throw new NotFoundException(`Auth with username "${email}" not found`);
    }
    return auth;
  }

  async validateUser(username: string, password: string): Promise<Auth | null> {
    const user = await this.findByEmail(username);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10)
  }

  async updateRefreshToken(userId: Types.ObjectId, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.update(userId.toString(), {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: Types.ObjectId, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({
          sub: userId,
          email: email
        },
        {
          secret: this.configService.get<string>("JWT_SECRET_KEY"),
          expiresIn: '15m'
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>("JWT_REFRESH_SECRET_KEY"),
          expiresIn: '7d'
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };

  }


}
