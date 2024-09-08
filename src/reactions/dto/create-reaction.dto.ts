import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ReactionType } from 'src/types/reactions.types';

export class CreateReactionDto {
  @IsNotEmpty({ message: 'Post Id is Required' })
  @IsString({ message: 'Post Id Needs To Be a String' })
  post: string;

  @IsNotEmpty({ message: 'Reaction From ID is required' })
  reactionFrom: string;

  @IsNotEmpty({ message: 'Reacted To ID is required' })
  reactedTo: string;

  @IsNotEmpty({ message: 'Reaction Type is Required!' })
  @IsEnum(ReactionType, {
    message: 'Type must be either like, comment, or share!',
  })
  type: string;

  content: string;
}
