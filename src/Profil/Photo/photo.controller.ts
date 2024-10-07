import { PhotoService } from "./photo.service";
import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, NotFoundException, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Photo } from "./schemas/photo.schema";
import { CreatePhotoDto } from "./dtos/create.photo";
import { AuthGuard } from "src/auth/auth-classique/guards/auth.guard";

@ApiTags("Photos")
@Controller("Photo")
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Get()
  @ApiOperation({ summary: "Get all Photos" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "All photos retrieved successfully",
    type: [Photo]
  })
  async getAllPhotos(): Promise<Photo[]> {
    return this.photoService.getAllPhotos();
  }

  @Get(':id')
  @ApiOperation({ summary: "Get a photo by ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Photo retrieved successfully",
    type: Photo
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Photo not found"
  })
  async getPhotoById(@Param('id') id: string): Promise<Photo> {
    const photo = await this.photoService.getPhotoById(id);
    if (!photo) {
      throw new NotFoundException('Photo not found');
    }
    return photo;
  }

  @Post()
  @ApiOperation({ summary: "Create a new photo" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Photo created successfully",
    type: Photo
  })
  async createPhoto(@Body() createPhotoDto: CreatePhotoDto): Promise<Photo> {
    return this.photoService.createPhoto(createPhotoDto);
  }

  /*@Put(':id')
  @ApiOperation({ summary: "Update a photo" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Photo updated successfully",
    type: Photo
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Photo not found"
  })
  async updatePhoto(
    @Param('id') id: string,
    @Body() updatePhotoDto: UpdatePhotoDto
  ): Promise<Photo> {
    const updatedPhoto = await this.photoService.updatePhoto(id, updatePhotoDto);
    if (!updatedPhoto) {
      throw new NotFoundException('Photo not found');
    }
    return updatedPhoto;
  }*/

  @Delete(':id')
  @ApiOperation({ summary: "Delete a photo" })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "Photo deleted successfully"
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Photo not found"
  })
  async deletePhoto(@Param('id') id: string): Promise<void> {
    const result = await this.photoService.deletePhoto(id);
    // if (!result) {
    //   throw new NotFoundException('Photo not found');
    // }
  }
}
