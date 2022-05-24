import { Expose, Transform, TransformFnParams } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class UserSignUpDTO {
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Expose()
  @MinLength(1)
  public name: string;

  @IsEmail()
  @Transform(({ value }: TransformFnParams) => value?.trim()?.toLowerCase())
  @Expose()
  @MinLength(1)
  public email: string;

  @IsString()
  @Expose()
  @MinLength(6)
  public password: string;
}
