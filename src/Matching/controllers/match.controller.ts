import { MatchService } from "../match.service";
import { Match } from "../schemas/match.schemas";
import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiParam } from "@nestjs/swagger";
import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException } from "@nestjs/common";
import { CreateMatchDto } from "../dtos/match.create";
import { UpdateMatchDto } from "../dtos/match.update";

@ApiTags("matching")
@Controller("matching")
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get()
  @ApiOperation({ summary: "Get all matches" })
  @ApiResponse({ status: 200, type: [Match] })
  async getAllMatches(): Promise<Match[]> {
    return this.matchService.getAllMatch();
  }

  @Get(':id')
  @ApiOperation({ summary: "Get a match by ID" })
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
  @ApiOperation({ summary: "Create a new match" })
  @ApiResponse({ status: 201, type: Match })
  @ApiBody({ type: CreateMatchDto })
  async createMatch(@Body() createMatchDto: CreateMatchDto): Promise<Match> {
    return this.matchService.createMatch(createMatchDto);
  }

  @Put(':id')
  @ApiOperation({ summary: "Update a match" })
  @ApiResponse({ status: 200, type: Match })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ type: UpdateMatchDto })
  async updateMatch(
    @Param('id') id: string,
    @Body() updateMatchDto: UpdateMatchDto
  ): Promise<Match> {
    const updatedMatch = await this.matchService.updateMatch(id, updateMatchDto);
    if (!updatedMatch) {
      throw new NotFoundException('Match not found');
    }
    return updatedMatch;
  }

  @Delete(':id')
  @ApiOperation({ summary: "Delete a match" })
  @ApiResponse({ status: 204, description: 'Match deleted successfully' })
  @ApiParam({ name: 'id', type: 'string' })
  async deleteMatch(@Param('id') id: string): Promise<void> {
    const result = await this.matchService.deleteMatch(id);
    if (!result) {
      throw new NotFoundException('Match not found');
    }
  }
}
