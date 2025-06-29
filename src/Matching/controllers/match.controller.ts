import { MatchService } from '../match.service';
import { Match } from '../schemas/match.schemas';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { CreateMatchDto } from '../dtos/match.create';
import { UpdateMatchDto } from '../dtos/match.update';
import { AuthGuard } from 'src/auth/auth-classique/guards/auth.guard';
import { Admin } from 'src/auth/common/decorators/isAdmin.decorator';
import { CurrentUser } from 'src/auth/common/decorators/currentUser.decorator';
import { TokenDto } from 'src/auth/common/dto/token.dto';

@ApiTags('matching')
@Controller('matching')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get()
  @Admin()
  @ApiOperation({ summary: 'Get all matches' })
  @ApiResponse({ status: 200, type: [Match] })
  async getAllMatches(): Promise<Match[]> {
    return this.matchService.getAllMatch();
  }

  @Get('me')
  @ApiOperation({ summary: 'Get all matches for the current user' })
  @ApiResponse({ status: 200, type: [Match] })
  async getAllMatchesForCurrentUser(@CurrentUser() user: TokenDto): Promise<Match[]> {
    return this.matchService.getAllMatchForCurrentUser(user); 
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a match by ID' })
  @ApiResponse({ status: 200, type: Match })
  @ApiParam({ name: 'id', type: 'string' })
  async getMatch(@Param('id') id: string): Promise<Match> {
    const match = await this.matchService.getMatchById(id);
    if (!match) {
      throw new NotFoundException('Match not found');
    }
    return match;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new match' })
  @ApiResponse({ status: 201, type: Match })
  @ApiBody({ type: CreateMatchDto })
  async createMatch(@Body() createMatchDto: CreateMatchDto): Promise<Match> {
    return this.matchService.createMatch(createMatchDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a match' })
  @ApiResponse({ status: 200, type: Match })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ type: UpdateMatchDto })
  async updateMatch(
    @Param('id') id: string,
    @Body() updateMatchDto: UpdateMatchDto,
  ): Promise<Match> {
    const updatedMatch = await this.matchService.updateMatch(
      id,
      updateMatchDto,
    );
    if (!updatedMatch) {
      throw new NotFoundException('Match not found');
    }
    return updatedMatch;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a match' })
  @ApiResponse({ status: 204, description: 'Match deleted successfully' })
  @ApiParam({ name: 'id', type: 'string' })
  async deleteMatch(@Param('id') id: string): Promise<void> {
    const result = await this.matchService.deleteMatch(id);
    if (!result) {
      throw new NotFoundException('Match not found');
    }
  }
}
