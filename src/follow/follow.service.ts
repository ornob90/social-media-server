import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Follower } from 'src/schemas/follows.schema';
import { CreateFollowDto } from './dto/create-follow.dto';

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(Follower.name) private followModel: Model<Follower>,
  ) {}

  async addFollow(createFollowDto: CreateFollowDto) {
    const followInstance = new this.followModel(createFollowDto);

    const follow = await followInstance.save();

    if (!follow) {
      throw new InternalServerErrorException('Failed to follow this user!');
    }

    return follow;
  }

  async removeFollow(followId: string) {
    const removeResponse = await this.followModel.findByIdAndDelete(followId);

    if (!removeResponse) {
      throw new InternalServerErrorException('Failed to unfollow the user!');
    }

    return null;
  }
}
