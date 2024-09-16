import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { InscriptionDto } from "./dto/inscription.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { ConnexionDto } from "./dto/connexion.dto";
import { AuthGuard } from "./guards/auth.guard";
import { Public } from "./decorators/public.decorator";
import { Admin } from "./decorators/isAdmin.decorator";

@Controller('auth')
@ApiTags('Auth Classique')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('SignUp')
  signUp(@Body() InscriptionDto: InscriptionDto) {
    return this.authService.signUp(InscriptionDto);
  }


  @Post('SignIn')
  signIn(@Body() connexionDto: ConnexionDto) {
    return this.authService.signIn(connexionDto);
  }

  @UseGuards(AuthGuard)
  @Admin()
  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }
}
