import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Auth, AuthDocument } from "./schemas/auth.schema";
import { Model, Schema, Types } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../Profil/User/user.service";
import { InscriptionDto } from "./dto/inscription.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import * as bcrypt from "bcrypt";
import { ConnexionDto } from "./dto/connexion.dto";






@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
  }

  async signUp(inscriptionDto: InscriptionDto): Promise<any> {
    try {
      const userExists = await this.authModel.findOne({ email: inscriptionDto.email });
      if (userExists) {
        throw new BadRequestException("User already exists");
      }

      console.log(inscriptionDto);

      // Hacher le mot de passe et créer l'auth
      const hashedPassword = await this.hashData(inscriptionDto.password);
      const createdAuth = new this.authModel({
        _id: new Types.ObjectId(),
        ...inscriptionDto,
        password: hashedPassword
      });


      await createdAuth.save();
      try {
        // Générer les tokens
        console.log("createdAuth", createdAuth)
        const tokens = await this.getTokens(createdAuth._id, createdAuth.email, createdAuth.roles);
        await this.updateRefreshToken(createdAuth._id, tokens.refreshToken);
        const createdUser = await this.userService.create({
          _id: createdAuth._id,
          email: createdAuth.email,
          age_range: { max: 0, min: 0 },
          bio: "",
          birthdate: undefined,
          children: "",
          deal_breakers: [],
          dietary_preferences: [],
          dream_vacation: "",
          drinker: "",
          education: "",
          ethnicity: "",
          exercise_frequency: "",
          favorite_movies: [],
          favorite_music: [],
          favorite_tv_shows: [],
          first_name: "",
          gender_ID: 0,
          height: 0,
          hobbies: [],
          interested_genre: [],
          interests: [],
          languages: [],
          last_name: "",
          location: "",
          looking_for: "",
          nickname: "",
          occupation: "",
          personality_type: "",
          pets: [],
          photos: [],
          political_views: "",
          popularity: 0,
          preferred_communication_style: [],
          preferred_distance_range: { max: 0, min: 0 },
          relationship_status: "",
          religion: "",
          smoker: false,
          social_media_links: {},
          travel_frequency: "",
          vaccination_status: "",
          verification_status: false,
          verified_photos: false,
          weight: 0,
          work_life_balance: "",
          zodiac_sign: ""
        });
        return { tokens, createdAuth, createdUser };
      } catch (error) {
        await this.authModel.findByIdAndDelete(createdAuth._id);
        throw new InternalServerErrorException("Une erreur interne est survenue lors de la création de l'utilisateur", { cause: error });
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.log(error)
      throw new InternalServerErrorException("Une erreur interne est survenue",  error );
    }
  }


  async signIn(connexionDto: ConnexionDto): Promise<{ accessToken: string; refreshToken: string }> {
    const validatedUser = await this.validateUser(connexionDto.email, connexionDto.password);
    if (!validatedUser) {
      throw new UnauthorizedException("Invalid credentials");
    }
    console.log("validatedUser", validatedUser)
    const tokens = await this.getTokens(validatedUser._id, validatedUser.email,validatedUser.roles);
    await this.updateRefreshToken(validatedUser._id, tokens.refreshToken);
    return tokens;
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

  // async remove(id: string): Promise<Auth> {
  //   const deletedAuth = await this.authModel.findByIdAndDelete(id).exec();
  //   if (!deletedAuth) {
  //     throw new NotFoundException(`Auth with ID "${id}" not found`);
  //   }
  //   return deletedAuth;
  // }

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
    console.log(data);
    return bcrypt.hash(data, 10);
  }

  async updateRefreshToken(userId: Types.ObjectId, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.authModel.findByIdAndUpdate(userId, {
      refreshToken: hashedRefreshToken
    });
  }


  async getTokens(userId: Types.ObjectId, email: string, roles: string[]) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({
          sub: userId,
          email: email,
          roles: roles,
        },
        {
          secret: this.configService.get<string>("JWT_SECRET_KEY"),
          expiresIn: "15m"
        }
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email
        },
        {
          secret: this.configService.get<string>("JWT_REFRESH_SECRET_KEY"),
          expiresIn: "7d"
        }
      )
    ]);

    return {
      accessToken,
      refreshToken
    };

  }


}
