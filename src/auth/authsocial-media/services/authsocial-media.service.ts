import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth-classique/services/auth.service';
import { Model } from 'mongoose';
import { Auth, AuthDocument } from '../../auth-classique/schemas/auth.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthsocialMediaService {
  constructor(
    @InjectModel (Auth.name) private authModel: Model<AuthDocument>,
    private readonly authService: AuthService){}


  async googleAuth(googleUser:any) {
    const {email}=googleUser;
    if (await this.authModel.findOne({ email: email })) {
      return await this.authService.signIn({email,password:""});
    }else{
      return await this.authService.signUp({email,password:""});
    }
  }
}
