import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSharePostDto {
  @IsNotEmpty({ message: 'Share post content is required!' })
  @IsString({ message: 'Share post content needs to be a string' })
  sharePostContent: string;

  @IsNotEmpty({ message: 'Shared By info is required!' })
  @IsString({ message: 'Share By needs to be a string' })
  sharedBy: string;
}
