import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GeolocationService } from './geolocation.service';
import { Geolocation } from './schemas/geolocation.schema';
import { User } from '../User/schemas/user.schema';
import {
  CreateGeolocationDto,
  UpdateGeolocationDto
} from './dtos/geolocation.dto';
import { AuthGuard } from 'src/auth/auth-classique/guards/auth.guard';
import { CurrentUser } from 'src/auth/common/decorators/currentUser.decorator';

@ApiTags('geolocation')
@Controller('geolocation')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class GeolocationController {
  constructor(private readonly geolocationService: GeolocationService) { }

  @Post()
  @ApiOperation({ summary: 'Créer ou mettre à jour la géolocalisation d\'un utilisateur' })
  @ApiResponse({ status: 201, type: Geolocation })
  async createGeolocation(
    @CurrentUser() user,
    @Body() createGeolocationDto: CreateGeolocationDto,
  ): Promise<Geolocation> {
    // console.log("user " , typeof(user._id))
    return this.geolocationService.createGeolocation(user._id, createGeolocationDto);
  }

  @Get('user')
  @ApiOperation({ summary: 'Obtenir la géolocalisation d\'un utilisateur' })
  @ApiResponse({ status: 200, type: Geolocation })
  async getGeolocationByUserId(@CurrentUser() user): Promise<Geolocation> {
    const geolocation = await this.geolocationService.getGeolocationByUserId(user._id);
    if (!geolocation) {
      throw new NotFoundException('Géolocalisation non trouvée pour cet utilisateur');
    }
    return geolocation;
  }

  @Put('user')
  @ApiOperation({ summary: 'Mettre à jour la géolocalisation d\'un utilisateur' })
  @ApiResponse({ status: 200, type: Geolocation })
  async updateGeolocation(
    @CurrentUser() user, @Body() updateGeolocationDto: UpdateGeolocationDto
  ): Promise<Geolocation> {
    const updatedGeolocation = await this.geolocationService.updateGeolocationByUserId(
      user._id,
      updateGeolocationDto,
    );
    if (!updatedGeolocation) {
      throw new NotFoundException('Géolocalisation non trouvée pour cet utilisateur');
    }
    return updatedGeolocation;
  }

  @Delete('user')
  @ApiOperation({ summary: 'Supprimer la géolocalisation d\'un utilisateur' })
  @ApiResponse({ status: 204, description: 'Géolocalisation supprimée avec succès' })

  async deleteGeolocation(@CurrentUser() user): Promise<void> {
    const result = await this.geolocationService.deleteGeolocation(user._id);
    if (!result) {
      throw new NotFoundException('Géolocalisation non trouvée pour cet utilisateur');
    }
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Trouver des utilisateurs à proximité' })
  @ApiResponse({ status: 200, type: [User] })
  @ApiQuery({ name: 'maxDistance', required: true, description: 'Distance maximale en kilomètres' })
  async getNearbyUsers(@CurrentUser() user, @Query('maxDistance') maxDistance: number): Promise<User[]> {
    return this.geolocationService.getNearbyUsers(user, maxDistance);
  }

  // @Get('radius')
  // @ApiOperation({ summary: 'Trouver des utilisateurs dans un rayon donné' })
  // @ApiResponse({ status: 200, type: [User] })
  // @ApiQuery({ name: 'latitude', required: true, description: 'Latitude du point central' })
  // @ApiQuery({ name: 'longitude', required: true, description: 'Longitude du point central' })
  // @ApiQuery({ name: 'radius', required: true, description: 'Rayon en kilomètres' })
  // async getUsersWithinRadius(
  //   @Query('latitude') latitude: number,
  //   @Query('longitude') longitude: number,
  //   @Query('radius') radius: number,
  // ): Promise<User[]> {
  //   return this.geolocationService.getUsersWithinRadius(
  //     Number(latitude),
  //     Number(longitude),
  //     Number(radius),
  //   );
  // }
} 