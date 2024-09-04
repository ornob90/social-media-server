import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reaction } from 'src/schemas/reactions.schema';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { Post } from 'src/schemas/posts.schema';
import { ReactionType } from 'src/types/reactions.types';

@Injectable()
export class ReactionsService {
  private readonly fieldMap = {
    [ReactionType.LIKE]: 'likesCount',
    [ReactionType.COMMENT]: 'commentsCount',
    [ReactionType.SHARE]: 'sharesCount',
  };

  constructor(
    @InjectModel(Reaction.name) private reactionModel: Model<Reaction>,
    @InjectModel(Post.name) private postModel: Model<Post>,
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
    try {
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

      const fieldToUpdate = this.fieldMap[createReactionDto.type];

      const updateResponse = await this.postModel.findByIdAndUpdate(
        createReactionDto.post,
        {
          $inc: {
            [fieldToUpdate]: 1,
          },
        },
        { new: true },
      );

      return reaction;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async removeReaction(reactionId: string) {
    try {
      const response = await this.reactionModel.findOneAndDelete({
        _id: reactionId,
      });

      if (!response) {
        throw new NotFoundException('No Reaction Deleted!');
      }

      const fieldToUpdate = this.fieldMap[response.type];

      const updateResponse = await this.postModel.findByIdAndUpdate(
        response.post,
        {
          $inc: {
            [fieldToUpdate]: -1,
          },
        },
        { new: true },
      );

      return response;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
