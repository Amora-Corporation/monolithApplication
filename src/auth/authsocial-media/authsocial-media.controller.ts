import {
  ConsoleLogger,
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { GoogleOAuth2Guard } from './guards/google-Oauth.guard';
import { AuthsocialMediaService } from './services/authsocial-media.service';

@Controller('auth-socialmedia')
@ApiTags('Auth Social Media')
export class AuthsocialMediaController {
  private readonly logger = new ConsoleLogger(AuthsocialMediaController.name);

  constructor(
    private readonly authsocialMediaService: AuthsocialMediaService,
  ) {}

  @Public()
  @Get('google')
  @UseGuards(GoogleOAuth2Guard)
  @ApiOperation({ summary: 'Initiate Google OAuth2 login' })
  @ApiResponse({ status: 200, description: 'Google login initiated' })
  async login() {
    // Action pour initier le login via Google OAuth2, peut-être vide si redirection automatique
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleOAuth2Guard)
  @ApiOperation({ summary: 'Google OAuth2 callback' })
  @ApiResponse({ status: 200, description: 'User information from Google' })
  @ApiResponse({ status: 400, description: 'No user from Google' })
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    this.logger.log('Google Auth Callback reached');

    if (!req.user) {
      return res.status(400).json({ message: 'No user from Google' });
    }

    // Handle the authenticated user and possibly create/update in DB
    const authUser = await this.authsocialMediaService.googleAuth(req.user);

    return res.status(200).json({
      message: 'User information from Google',
      user: authUser,
    });
  }
}
