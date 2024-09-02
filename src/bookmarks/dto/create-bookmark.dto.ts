import { IsNotEmpty } from 'class-validator';

export class CreateBookmarkDto {
  @IsNotEmpty({ message: 'User ID is required!' })
  userId: string;

  @IsNotEmpty({ message: 'Post ID is required!' })
  postId: string;
}
