import { IsNotEmpty, IsIn, IsString } from 'class-validator';

export class UpdateCommentDto {
  @IsNotEmpty({ message: 'Content cannot be empty' })
  @IsString({ message: 'Content needs to be a string' })
  content: string;

  //   @IsNotEmpty({ message: 'Type is required' })
  //   @IsIn(['comment'], { message: 'Invalid type provided' })
  //   type: 'comment';
}
