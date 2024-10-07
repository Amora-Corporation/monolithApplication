import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBearerAuth } from "@nestjs/swagger";
import { Body, Controller, HttpStatus, Post, Get, Put, Delete, Param, NotFoundException, UseGuards } from "@nestjs/common";
import { MatchPreferenceService } from "../matchPreference.service";
import { MatchPreference } from "../schemas/matchPreference.schemas";
import { CreateMatchPreferenceDto } from "../dtos/matchPreference.create";
import { UpdateMatchPreferenceDto } from "../dtos/matchPreference.update";
import { AuthGuard } from "src/auth/auth-classique/guards/auth.guard";

@ApiTags("matching")
@Controller("matchingPreference")
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class MatchPreferenceController {
  constructor(private readonly matchPreferenceService: MatchPreferenceService) {}

  @Post()
  @ApiOperation({ summary: "Create new match preference" })
  @ApiResponse({ status: HttpStatus.CREATED, type: MatchPreference })
  @ApiBody({ type: CreateMatchPreferenceDto })
  async createMatchPreference(@Body() createMatchPreferenceDto: CreateMatchPreferenceDto): Promise<MatchPreference> {
    return this.matchPreferenceService.createMatchPreference(createMatchPreferenceDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all match preferences" })
  @ApiResponse({ status: HttpStatus.OK, type: [MatchPreference] })
  async getAllMatchPreferences(): Promise<MatchPreference[]> {
    return this.matchPreferenceService.getAllMatchPreferences();
  }

  @Get(':id')
  @ApiOperation({ summary: "Get a match preference by ID" })
  @ApiResponse({ status: HttpStatus.OK, type: MatchPreference })
  @ApiParam({ name: 'id', type: 'string' })
  async getMatchPreference(@Param('id') id: string): Promise<MatchPreference> {
    const matchPreference = await this.matchPreferenceService.getMatchPreferenceById(id);
    if (!matchPreference) {
      throw new NotFoundException('Match preference not found');
    }
    return matchPreference;
  }

  @Put(':id')
  @ApiOperation({ summary: "Update a match preference" })
  @ApiResponse({ status: HttpStatus.OK, type: MatchPreference })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ type: UpdateMatchPreferenceDto })
  async updateMatchPreference(
    @Param('id') id: string,
    @Body() updateMatchPreferenceDto: UpdateMatchPreferenceDto
  ): Promise<MatchPreference> {
    const updatedMatchPreference = await this.matchPreferenceService.updateMatchPreference(id, updateMatchPreferenceDto);
    if (!updatedMatchPreference) {
      throw new NotFoundException('Match preference not found');
    }
    return updatedMatchPreference;
  }

  @Delete(':id')
  @ApiOperation({ summary: "Delete a match preference" })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Match preference deleted successfully' })
  @ApiParam({ name: 'id', type: 'string' })
  async deleteMatchPreference(@Param('id') id: string): Promise<void> {
    const result = await this.matchPreferenceService.deleteMatchPreference(id);
    if (!result) {
      throw new NotFoundException('Match preference not found');
    }
  }
}
