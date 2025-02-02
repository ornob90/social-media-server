import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
