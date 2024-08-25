import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/schemas/posts.schema';
import { Reaction } from 'src/schemas/reactions.schema';
import { CreateReactionDto } from './dto/create-reaction.dto';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectModel(Reaction.name) private reactionModel: Model<Reaction>,
  ) {}

  async getPaginatedComments(
    userId: string,
    postId: string,
    page = 1,
    limit = 10,
  ) {
    const skip = (page - 1) * limit;

    const comments = await this.reactionModel
      .find({
        user: userId,
        post: postId,
        type: 'comment',
      })
      .skip(skip)
      .limit(limit)
      .exec();

    return comments;
  }

  async createReaction(createReactionDto: CreateReactionDto) {
    const isExist = await this.reactionModel.findOne({
      post: createReactionDto.post,
      user: createReactionDto.user,
      type: createReactionDto.type,
    });

    if (createReactionDto.type === 'comment' && !createReactionDto?.content) {
      throw new BadRequestException('Content is Required for Comment!');
    }

    if (isExist && createReactionDto.type !== 'comment') {
      throw new BadRequestException('Reaction Already Exist!');
    }

    const reactionInstance = new this.reactionModel(createReactionDto);

    const reaction = await reactionInstance.save();

    return reaction;
  }

  async removeReaction(userId: string, postId: string) {
    const response = await this.reactionModel.deleteOne({
      post: postId,
      user: userId,
    });

    if (response.deletedCount === 0) {
      throw new NotFoundException('No Reaction Deleted!');
    }

    return response;
  }
}
