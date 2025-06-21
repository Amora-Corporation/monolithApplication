import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from '../schemas/auth.schema';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../../Profil/User/user.service';
import { InscriptionDto } from '../../common/dto/inscription.dto';
import { UpdateAuthDto } from '../../common/dto/update-auth.dto';
import * as bcrypt from 'bcrypt';
import { ConnexionDto } from '../../common/dto/connexion.dto';
import * as otplib from 'otplib';
import { MailService } from './mail.service';
import { ForgotPasswordDto } from 'src/auth/common/dto/forgot-password.dto';
import { randomInt } from 'crypto';
import { User, UserDocument } from 'src/Profil/User/schemas/user.schema';
import { TokenDto } from 'src/auth/common/dto/token.dto';
@Injectable()
export class AuthService {
  private readonly tempsMails = new Map<
    string,
    { password: string; otp: string; expiresAt: Date }
  >();

  private readonly OTP_EXPIRATION_MINUTES = 10;
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOGIN_ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes

  private readonly loginAttempts = new Map<
    string,
    { count: number; lastAttempt: Date }
  >();

  

  constructor(
    @InjectModel(Auth.name) private readonly authModel: Model<Auth>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {
    otplib.authenticator.options = { step: 10 };
  }

  async signUp(inscriptionDto: InscriptionDto): Promise<any> {
    const userExists = await this.authModel.findOne({ email: inscriptionDto.email });

    if (userExists) {
      throw new BadRequestException('Cet utilisateur existe déjà');
    }

    const hashedPassword = await this.hashData(inscriptionDto.password);
    const newUserId = new Types.ObjectId();

    const createdAuth = new this.authModel({
      _id: newUserId,
      ...inscriptionDto,
      password: hashedPassword,
    });

    let savedAuth = null;
    let savedUser = null;

    try {
      savedAuth = await createdAuth.save();

      const user = await this.userModel.create({
        _id: createdAuth._id,
        email: createdAuth.email,
      });

      savedUser = await user.save();

      const tokenDto: TokenDto = {
        _id: savedAuth._id.toString(),
        email: savedAuth.email,
        roles: savedAuth.roles,
      };

      const tokens = await this.getTokens(tokenDto);

      return tokens;
    } catch (error) {
      if (savedAuth && !savedUser) {
        await this.authModel.findByIdAndDelete(savedAuth._id);
      }

      if (savedUser && !savedAuth) {
        await this.userModel.findByIdAndDelete(savedUser._id);
      }

      throw new InternalServerErrorException(
        "Erreur lors de la création de l'utilisateur",
        { cause: error },
      );
    }
  }

  async signIn(
    connexionDto: ConnexionDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const attempts = this.loginAttempts.get(connexionDto.email);

    if (attempts && attempts.count >= this.MAX_LOGIN_ATTEMPTS) {
      const timeSinceLast = Date.now() - attempts.lastAttempt.getTime();

      if (timeSinceLast < this.LOGIN_ATTEMPT_WINDOW) {
        const remaining = Math.ceil((this.LOGIN_ATTEMPT_WINDOW - timeSinceLast) / 60000);
        throw new UnauthorizedException(
          `Trop de tentatives. Réessayez dans ${remaining} minutes.`,
        );
      }

      this.loginAttempts.delete(connexionDto.email);
    }

    const validatedAuthUser = await this.validateUser(
      connexionDto.email,
      connexionDto.password,
    );

    if (!validatedAuthUser) {
      const current = this.loginAttempts.get(connexionDto.email) || { count: 0, lastAttempt: new Date() };
      this.loginAttempts.set(connexionDto.email, {
        count: current.count + 1,
        lastAttempt: new Date(),
      });

      throw new UnauthorizedException('Identifiants invalides');
    }

    this.loginAttempts.delete(connexionDto.email);

    const validatedUser = await this.userService.findOne(validatedAuthUser._id);
    if (!validatedUser) {
      throw new NotFoundException('Profil utilisateur non trouvé');
    }
    const tokenDto: TokenDto = {  
      _id: validatedAuthUser._id.toString(),
      email: validatedAuthUser.email,
      roles: validatedAuthUser.roles,
    };
    const tokens = await this.getTokens(tokenDto);

    await this.authModel.findByIdAndUpdate(validatedAuthUser._id, {
      lastLogin: new Date(),
    });

    return tokens;
  }

  async findAll(): Promise<Auth[]> {
    return this.authModel.find().exec();
  }

  async findOne(id: string): Promise<Auth> {
    try {
      const auth = await this.authModel.findById(new Types.ObjectId(id)).exec();
      if (!auth) {
        throw new NotFoundException(`Utilisateur avec l'ID "${id}" non trouvé`);
      }
      return auth;
    } catch (error) {
      throw new NotFoundException(`Erreur lors de la recherche de l'utilisateur avec l'ID "${id}": ${error.message}`);
    }
  }

  async update(id: string, updateAuthDto: UpdateAuthDto): Promise<Auth> {
    if (updateAuthDto.password) {
      updateAuthDto.password = await bcrypt.hash(updateAuthDto.password, 10);
    }

    const updatedAuth = await this.authModel
      .findByIdAndUpdate(id, updateAuthDto, { new: true })
      .exec();

    if (!updatedAuth) {
      throw new NotFoundException(`Utilisateur avec l'ID "${id}" non trouvé`);
    }

    return updatedAuth;
  }

  async signInOrUp(
    insCoDto: InscriptionDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    console.log("insCoDto.email", insCoDto.email);
    const existingUser = await this.authModel.findOne({ email: insCoDto.email });

    if (existingUser) {
      await this.validateUser(insCoDto.email, insCoDto.password);
      return this.signIn(insCoDto);
    }

    return this.signUp(insCoDto);
  }

  async verifyOtp(
    email: string,
    otp: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const tempData = this.tempsMails.get(email);

    if (!tempData) {
      throw new BadRequestException('Aucune tentative trouvée pour cet e-mail.');
    }

    if (new Date() > tempData.expiresAt) {
      this.tempsMails.delete(email);
      throw new UnauthorizedException('OTP expiré. Veuillez réessayer.');
    }

    if (otp !== tempData.otp) {
      throw new UnauthorizedException('OTP invalide');
    }

    this.tempsMails.delete(email);

    const user = await this.authModel.findOne({ email });
    if (user) {
      return this.signIn({ email, password: tempData.password });
    }

    return this.signUp({ email, password: tempData.password });
  }

  async findByEmail(email: string): Promise<Auth> {
    const auth = await this.authModel.findOne({ email }).exec();
    if (!auth) {
      throw new NotFoundException(`Utilisateur avec l'email "${email}" non trouvé`);
    }
    return auth;
  }

  async validateUser(username: string, password: string): Promise<Auth | null> {
    const userAuth = await this.findByEmail(username);

    if (userAuth.isBlocked) {
      throw new UnauthorizedException('Compte bloqué. Contactez le support.');
    }

    const isValid = await bcrypt.compare(password, userAuth.password);
    if (!isValid) {
      throw new UnauthorizedException('Mot de passe invalide');
    }

    return userAuth;
  }

  async hashData(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  async getTokens(tokenDto: TokenDto) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { _id: tokenDto._id, email: tokenDto.email, roles: tokenDto.roles },
        {
          secret: this.configService.get<string>('JWT_SECRET_KEY'),
          expiresIn: '2h',
        },
      ),
      this.jwtService.signAsync(
        { _id: tokenDto._id, email: tokenDto.email , roles: tokenDto.roles},
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET_KEY'),
          expiresIn: '7d',
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async sendOtp(email: string, otp: string) {
    const result = await this.mailService.sendOtpEmail(email, otp);
    if (!result.success) {
      throw new UnauthorizedException("Erreur lors de l'envoi de l'OTP");
    }

    return { message: 'OTP envoyé par email' };
  }

  async forgotPassword(forgotPasswordDTO: ForgotPasswordDto) {
    const existingUser = await this.authModel.findOne({ email: forgotPasswordDTO.email });

    if (!existingUser) {
      return { message: 'Si cet email existe, un OTP a été envoyé' };
    }

    const secret = randomInt(100000, 999999).toString();
    const otp = otplib.authenticator.generate(secret);

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.OTP_EXPIRATION_MINUTES);

    this.tempsMails.set(forgotPasswordDTO.email, {
      password: secret,
      otp,
      expiresAt,
    });

    await this.sendOtp(forgotPasswordDTO.email, otp);

    return {
      message: 'OTP envoyé avec succès',
      expiresIn: `${this.OTP_EXPIRATION_MINUTES} minutes`,
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET_KEY'),
      });

      if (!payload || typeof payload !== 'object') {
        throw new UnauthorizedException('Payload du token invalide');
      }

      const userId = new Types.ObjectId(payload.sub);
      const user = await this.authModel.findById(userId);

      if (!user) {
        throw new UnauthorizedException('Utilisateur non trouvé');
      }
      const tokenDto: TokenDto = {
        _id: user._id.toString(),
        email: user.email,
        roles: user.roles,
      };
      return this.getTokens(tokenDto);
    } catch (error) {
      console.error('Erreur de rafraîchissement du token:', error);
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }
}
