import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Get,
  Put,
  Delete,
  Param,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { MatchPreferenceService } from '../matchPreference.service';
import { MatchPreference } from '../schemas/matchPreference.schemas';
import { CreateMatchPreferenceDto } from '../dtos/matchPreference.create';
import { UpdateMatchPreferenceDto } from '../dtos/matchPreference.update';
import { AuthGuard } from 'src/auth/auth-classique/guards/auth.guard';
import { CurrentUser } from 'src/auth/common/decorators/currentUser.decorator';
import { TokenDto } from 'src/auth/common/dto/token.dto';
import { Admin } from 'src/auth/common/decorators/isAdmin.decorator';

@ApiTags('matchingPreference')
@Controller('matchingPreference')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class MatchPreferenceController {
  constructor(
    private readonly matchPreferenceService: MatchPreferenceService,
  ) {}

  @Post('me')
  @ApiOperation({ summary: 'Create new match preference' })
  @ApiResponse({ status: HttpStatus.CREATED, type: MatchPreference })
  @ApiBody({ type: CreateMatchPreferenceDto })
  async createMatchPreference(
    @Body() createMatchPreferenceDto: CreateMatchPreferenceDto,
    @CurrentUser() user: TokenDto,
  ): Promise<MatchPreference> {
    return this.matchPreferenceService.createMatchPreference(
      createMatchPreferenceDto,
      user
    );
  }

  @Get()
  @Admin()
  @ApiOperation({ summary: 'Get all match preferences' })
  @ApiResponse({ status: HttpStatus.OK, type: [MatchPreference] })
  async getAllMatchPreferences(): Promise<MatchPreference[]> {
    return this.matchPreferenceService.getAllMatchPreferences();
  }

  @Get('me')
  @ApiOperation({ summary: 'Get a match preference by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: MatchPreference })
  async getMatchPreference(@CurrentUser() user: TokenDto): Promise<MatchPreference> {
    return this.matchPreferenceService.getMatchPreferenceById(user._id);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update a match preference' })
  @ApiResponse({ status: HttpStatus.OK, type: MatchPreference })
  @ApiBody({ type: UpdateMatchPreferenceDto })
  async updateMatchPreference(
    @CurrentUser() user: TokenDto,
    @Body() updateMatchPreferenceDto: UpdateMatchPreferenceDto,
  ): Promise<MatchPreference> {
    const updatedMatchPreference =
      await this.matchPreferenceService.updateMatchPreference(
        user._id,
        updateMatchPreferenceDto,
      );
    if (!updatedMatchPreference) {
      throw new NotFoundException('Match preference not found');
    }
    return updatedMatchPreference;
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete a match preference' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Match preference deleted successfully',
  })
  async deleteMatchPreference(@CurrentUser() user: TokenDto): Promise<void> {
    const result = await this.matchPreferenceService.deleteMatchPreference(user._id);
    if (!result) {
      throw new NotFoundException('Match preference not found');
    }
  }
}
