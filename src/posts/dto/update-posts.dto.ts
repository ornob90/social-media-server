import {
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdatePostsDto {
  user: string;

  @IsNotEmpty({ message: 'Post Id is required!' })
  @IsString({ message: 'Post Id have to be a string' })
  @Length(24, 24, {
    message: 'Post Id length have to be 12characters long.',
  })
  postId: string;

  @IsNotEmpty({ message: 'post content cannot be empty!' })
  @IsString({ message: 'post content have to be a string' })
  readonly content: string;
}
