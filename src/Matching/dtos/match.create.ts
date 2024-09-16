import { IsBoolean, IsDate, IsMongoId, IsNotEmpty, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { Types } from "mongoose";

export class CreateMatchDto {
  @IsNotEmpty()
  @IsMongoId()
  userId1: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  userId2: Types.ObjectId;

  @IsDate()
  @Type(() => Date)
  matchDate?: Date;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}