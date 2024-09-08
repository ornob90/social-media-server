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
import { UpdateCommentDto } from './dto/update-comment.dto';

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
    // userId: string,
    postId: string,
    page = 1,
    limit = 10,
  ) {
    const skip = (page - 1) * limit;

    let totalCounts: number;
    if (skip === 0) {
      const totalComments = await this.reactionModel.find({
        post: postId,
        type: 'comment',
      });

      totalCounts = totalComments.length;
    }

    const comments = await this.reactionModel
      .find({
        // user: userId,
        post: postId,
        type: 'comment',
      })
      .skip(skip)
      .limit(limit)
      .populate('reactionFrom', 'email displayName userName photoUrl')
      .populate('reactedTo', 'email displayName userName photoUrl');

    return { totalCounts, comments };
  }

  async createReaction(createReactionDto: CreateReactionDto) {
    try {
      const isExist = await this.reactionModel.findOne({
        post: createReactionDto.post,
        reactionFrom: createReactionDto.reactionFrom,
        reactedTo: createReactionDto.reactedTo,
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

  async updateComment(
    postId: string,
    reactionFrom: string,
    reactedTo: string,
    updateCommentDto: UpdateCommentDto,
  ) {
    try {
      const reaction = await this.reactionModel.updateOne(
        {
          post: postId,
          reactionFrom: reactionFrom,
          reactedTo: reactedTo,
          type: 'comment',
        },
        {
          $set: updateCommentDto,
        },
      );

      if (!reaction.acknowledged || reaction.modifiedCount === 0) {
        throw new NotFoundException('No Comment Updated!');
      }

      return null;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async removeReaction(
    type: ReactionType,
    postId: string,
    reactionFrom: string,
    reactedTo: string,
  ) {
    try {
      const response = await this.reactionModel.findOneAndDelete({
        type,
        post: postId,
        reactionFrom: reactionFrom,
        reactedTo: reactedTo,
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
