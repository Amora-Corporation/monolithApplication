import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { InscriptionDto } from '../common/dto/inscription.dto';
import { UpdateAuthDto } from '../common/dto/update-auth.dto';
import { ConnexionDto } from '../common/dto/connexion.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiSecurity,
} from '@nestjs/swagger'; // Ajout de Swagger
import { AuthGuard } from './guards/auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { Admin } from '../common/decorators/isAdmin.decorator';
import { MailService } from './services/mail.service';
import { AuthService } from './services/auth.service';
import { ForgotPasswordDto } from '../common/dto/forgot-password.dto';
import { RefreshTokenRoute } from '../common/decorators/refreshToken.decorator';
import { JwtService } from '@nestjs/jwt';

@Controller('auth-classique')
@ApiTags('Auth Classique')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}
  private otpSecrets = new Map<string, string>();

  @Post('SignInOrUp')
  @ApiOperation({ summary: 'Sign in or sign up a user' })
  @ApiBody({ type: InscriptionDto }) // Utilisez InscriptionDto car il est partagé pour les deux cas
  @ApiResponse({
    status: 200,
    description: 'User successfully signed in or registered',
  })
  @ApiResponse({ status: 400, description: 'Invalid credentials' }) // Ajoutez d'autres réponses possibles
  @ApiResponse({ status: 500, description: 'Internal server error' }) // Erreur serveur
  async signInOrUp(@Body() insCoDto: InscriptionDto): Promise<any> {
    return this.authService.signInOrUp(insCoDto);
  }

  @Post('SignUp')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiBody({ type: InscriptionDto })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  signUp(@Body() inscriptionDto: InscriptionDto) {
    return this.authService.signUp(inscriptionDto);
  }

  @Post('SignIn')
  @ApiOperation({ summary: 'Sign in an existing user' })
  @ApiBody({ type: ConnexionDto })
  @ApiResponse({ status: 200, description: 'User successfully signed in' })
  signIn(@Body() connexionDto: ConnexionDto) {
    return this.authService.signIn(connexionDto);
  }

  @UseGuards(AuthGuard)
  @Admin()
  @Get()
  @ApiOperation({ summary: 'Retrieve all Auth User (Admin only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  findAll() {
    return this.authService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiBody({ type: UpdateAuthDto })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }

  @Public()
  @Post('/ForgotPassword')
  @ApiOperation({ summary: 'Initiate password reset process' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async forgotPassword(@Body() forgotPasswordDTO: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDTO);
  }

  // @Public()
  // @Post('sendOtp')
  // @ApiOperation({ summary: 'Send OTP to user\'s email' })
  // @ApiBody({ schema: { type: 'object', properties: { email: { type: 'string' } } } })
  // @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  // @ApiResponse({ status: 401, description: 'Error sending OTP' })
  // async sendOtp(@Body('email') email: string) {
  //   return this.authService.sendOtp(email);
  // }

  @Public()
  @Post('verifyOtp')
  @ApiOperation({ summary: 'Verify OTP received by email' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { email: { type: 'string' }, otp: { type: 'string' } },
    },
  })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  @ApiResponse({ status: 401, description: 'Incorrect or expired OTP' })
  async verifyOtp(@Body('email') email: string, @Body('otp') otp: string) {
    return this.authService.verifyOtp(email, otp);
  }

  @Post('refresh-token')
  @RefreshTokenRoute()
  @ApiOperation({ summary: 'Refresh access token using expired access token' })
  @ApiSecurity('bearer')
  @ApiResponse({ status: 200, description: 'Tokens refreshed successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: Invalid or missing token',
  })
  async refreshToken(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('No authorization header provided');
    }

    console.log('Authorization Header:', authHeader);
    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer') {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    return await this.authService.refreshToken(token);
  }
}
