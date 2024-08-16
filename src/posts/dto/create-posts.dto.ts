import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  user: string;

  @IsNotEmpty({ message: 'post content cannot be empty!' })
  @IsString({ message: 'post content have to be a string' })
  readonly content: string;

  readonly images?: string;
}
