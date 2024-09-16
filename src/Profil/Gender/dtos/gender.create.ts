import { IsMongoId, IsNotEmpty } from "class-validator";

export class CreateGerderDTO {

  @IsNotEmpty()
  @IsMongoId()
  name: string;

}