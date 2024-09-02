import { IsNotEmpty } from 'class-validator';

export class CreateFollowDto {
  @IsNotEmpty({ message: 'Following User Id is required!' })
  following: string;

  @IsNotEmpty({ message: 'Follower User Id is required!' })
  follower: string;
}
