import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from "@nestjs/common";
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiTags } from "@nestjs/swagger";
import { ClientProxy, MessagePattern } from "@nestjs/microservices";

@Controller('auth')
@ApiTags('Auth Classique')
export class AuthController {
  constructor(private readonly authService: AuthService,
              ) {}

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    const createdAuth = this.authService.signUp(createAuthDto);


    return createdAuth;
  }




  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
}
