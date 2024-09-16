import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, HttpStatus, Post } from "@nestjs/common";
import { Gender } from "./schemas/gender.schemas";
import { GenderService } from "./gender.service";
import { CreateGerderDTO } from "./dtos/gender.create";


@ApiTags("gender")
@Controller("gender")
export class GenderController {
  constructor(private readonly genderService: GenderService) {}

  @Get()
  @ApiOperation({ summary: "Get genders" })
  @ApiResponse({
    status: HttpStatus.OK,
    description:"tout les genders",
    type: Gender
  })
  async getGenders ():Promise<Gender[]> {
    return this.genderService.getAllGenders();
  }

  @Post()
  @ApiOperation({ summary: "Post gender" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:"Post gender",
    type: Gender
  })
  @ApiBody({ type: CreateGerderDTO })
  async create(@Body() createGenderDto: CreateGerderDTO): Promise<Gender> {
    return this.genderService.createGender(createGenderDto);
  }

}