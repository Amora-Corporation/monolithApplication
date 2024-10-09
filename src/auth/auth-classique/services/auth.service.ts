import {
  BadRequestException,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Auth, AuthDocument } from "../schemas/auth.schema";
import { Model, Schema, Types } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../../../Profil/User/user.service";
import { InscriptionDto } from "../../common/dto/inscription.dto";
import { UpdateAuthDto } from "../../common/dto/update-auth.dto";
import * as bcrypt from "bcrypt";
import { ConnexionDto } from "../../common/dto/connexion.dto";
import * as otplib from 'otplib';
import { MailService } from "./mail.service";
import { ForgotPasswordDto } from "src/auth/common/dto/forgot-password.dto";
import { randomInt } from "crypto";



@Injectable()
export class AuthService {
  
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {
    otplib.authenticator.options = { step: 10 };
  }

  private tempsMails = new Map<string, { password: string, otp: string }>();

  async signUp(inscriptionDto: InscriptionDto): Promise<any> {
    try {
      const userExists = await this.authModel.findOne({ email: inscriptionDto.email });
      if (userExists) {
        throw new BadRequestException("User already exists");
      }

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
          zodiac_sign: "",
          empty_account: true,
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
 
      throw new InternalServerErrorException("Une erreur interne est survenue", error);
    }
  }


  async signIn(connexionDto: ConnexionDto): Promise<{ accessToken: string; refreshToken: string; isEmptyAccount: boolean }> {
    const validatedAuthUser = await this.validateUser(connexionDto.email, connexionDto.password);
    if (!validatedAuthUser) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const validatedUser = await this.userService.findOne(validatedAuthUser._id);

    const tokens = await this.getTokens(validatedAuthUser._id, validatedAuthUser.email, validatedAuthUser.roles);
    await this.updateRefreshToken(validatedAuthUser._id, tokens.refreshToken);
    return {
      ...tokens,
      isEmptyAccount: validatedUser.empty_account,
    };

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
  async signInOrUp(insCoDto: InscriptionDto)
  //:
  //Promise<{ accessToken: string; refreshToken: string; isEmptyAccount: boolean }> 
  {
    try {
      const existingUser = await this.authModel.findOne({ email: insCoDto.email }).exec();

      if (existingUser) {
        const isPasswordValid = await bcrypt.compare(insCoDto.password, existingUser.password);
        if (!isPasswordValid) {
          throw new UnauthorizedException('Invalid password');
        }
      }

      //const hashedPassword = await this.hashData(insCoDto.password);
      console.log("insCoDto.password"+insCoDto.password)
      const otp = otplib.authenticator.generate(insCoDto.password);
      console.log(otp)
      this.sendOtp(insCoDto.email, otp);
      this.tempsMails.set(insCoDto.email, { password: insCoDto.password, otp });

      return { message: 'OTP envoyé à votre adresse e-mail. Veuillez vérifier pour continuer.' };
    } catch (error) {
      console.error("Error in signInOrUp:", error);
      throw new InternalServerErrorException("Une erreur interne est survenue");
    }
  }

  async verifyOtp(email: string, otp: string): Promise<{ accessToken: string, refreshToken: string }> {
    const tempData = this.tempsMails.get(email);
    if (!tempData) {
      throw new BadRequestException('Aucune tentative de connexion trouvée pour cet e-mail.');
    }

    const isOtpValid = otp===tempData.otp;
    //const isOtpValid = otplib.authenticator.check(otp, tempData.password);
    console.log("otp"+otp);
    console.log("tempDataOtp"+tempData.otp);
    console.log("password"+tempData.password);
    
    if (!isOtpValid) {
      throw new UnauthorizedException('OTP invalide');
    }
    // Si l'OTP est valide, générer les tokens
    const existingUser = await this.authModel.findOne({ email }).exec();
    if (existingUser) {
      return await this.signIn({ email, password: tempData.password });
    } else {
      this.tempsMails.delete(email);
      return await this.signUp({ email, password: tempData.password });
    }

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

  // generateOtp() {
  //   console.log(otplib.authenticator.generateSecret())
  //   return otplib.authenticator.generate(otplib.authenticator.generateSecret());
  // }

  // verifyOtpCode(otp: string, secret: string) {
  //   return otplib.authenticator.check(otp, secret);
  // }


  async sendOtp(email: string, otp: string) {
    const result = await this.mailService.sendOtpEmail(email, otp);
    if (!result.success) {
      throw new UnauthorizedException('Erreur lors de l\'envoi de l\'OTP');
    }
    return { message: 'OTP envoyé par email' };

  }


  async forgotPassword(forgotPasswordDTO: ForgotPasswordDto) {
    const existingUser = await this.authModel.findOne({ email: forgotPasswordDTO.email }).exec();
  
    if (!existingUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const secret= randomInt(100000, 999999).toString();
    const otp = otplib.authenticator.generate(secret);
    
    // Sauvegardez l'OTP dans la base de données ou un cache avec une durée de validité
    this.tempsMails.set(forgotPasswordDTO.email,{password:secret,otp:otp})
    // Envoyez l'OTP par email
    await this.sendOtp(forgotPasswordDTO.email, otp);
  
    return { message: 'OTP sent successfully' };
  }
}

