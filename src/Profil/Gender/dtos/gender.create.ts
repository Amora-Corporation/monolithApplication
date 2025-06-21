  import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';


export class CreateGerderDTO {    

  @ApiProperty({ description: 'The id of the gender' })
  @IsNotEmpty()
  @IsString()
  
  _id: string;  

  @ApiProperty({ description: 'The name of the gender' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
