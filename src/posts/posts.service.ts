import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { VerifiedRequestInterface } from 'src/types/middleware.types';
import { CreatePostDto } from './dto/create-posts.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from 'src/schemas/posts.schema';
import { model, Model } from 'mongoose';
import { UpdatePostsDto } from './dto/update-posts.dto';
import { Reaction } from 'src/schemas/reactions.schema';
import { User } from 'src/schemas/users.schema';
import { CreateSharePostDto } from './dto/create-share-post.dto';
import path from 'path';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Reaction.name) private reactionModel: Model<Reaction>,
  ) {}

  async getAllPosts(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    let totalPosts: number | null = null;

    if (skip === 0) {
      totalPosts = await this.postModel.estimatedDocumentCount();
    }

    const posts = await this.postModel.aggregate([
      {
        $lookup: {
          from: 'reactions',
          let: { postId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$post', '$$postId'] },
                    { $eq: ['$reactionFrom', userId] },
                    { $eq: ['$type', 'like'] },
                  ],
                },
              },
            },
          ],
          as: 'reactions',
        },
      },
      {
        $addFields: {
          isLiked: {
            $gt: [{ $size: '$reactions' }, 0],
          },
        },
      },
      // {
      //   $unset: 'reactions',
      // },
      {
        $sort: { createdAt: -1 },
      },
      { $skip: skip },
      { $limit: limit },
    ]);

    await this.postModel.populate(posts, [
      {
        path: 'user',
        model: User.name,
        select: 'displayName email photoUrl userName',
      },
      {
        path: 'sharedPostId',
        model: Post.name,
        populate: {
          path: 'user',
          model: User.name,
          select: 'displayName email photoUrl userName',
        },
      },
    ]);

    return { totalPosts, posts };
  }

  async getPostsByUser(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const totalPosts = await this.postModel
      .find({ user: userId })
      .estimatedDocumentCount();

    if (totalPosts === 0) {
      throw new NotFoundException('No Posts Found!');
    }

    const posts = await this.postModel
      .find({ user: userId })
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      totalPosts,
      posts,
    };
  }

  async getPostDetails(userId: string, postId: string) {
    const post = await this.postModel.findOne({ _id: postId, user: userId });
    if (!post) {
      throw new NotFoundException('No Post Found!');
    }

    return post;
  }

  async create(req: VerifiedRequestInterface, createPostsDto: CreatePostDto) {
    const { _id: userId } = req.user;

    createPostsDto.user = userId;

    const postInstance = new this.postModel(createPostsDto);
    const post = await postInstance.save();

    return post;
  }

  async createSharePost(
    sharePostId: string,
    createSharePostDto: CreateSharePostDto,
  ) {
    try {
      const sharedPost = await this.postModel.findById(sharePostId);

      if (!sharedPost) {
        throw new NotFoundException('No Post Found For Share!');
      }

      const postData = {
        user: sharedPost.user,
        content: sharedPost.content,
        images: sharedPost.images,
        likesCount: sharedPost.likesCount,
        commentsCount: sharedPost.commentsCount,
        sharesCount: sharedPost.sharesCount,
        sharePostId,
        ...createSharePostDto,
      };

      const postInstance = new this.postModel(postData);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(req: VerifiedRequestInterface, updatePostsDto: UpdatePostsDto) {
    const { _id: userId } = req.user;
    updatePostsDto.user = userId;

    const { postId } = updatePostsDto;

    delete updatePostsDto.postId;

    const isExist = await this.postModel.findOne({ _id: postId });

    if (!isExist) {
      throw new NotFoundException('Post Not Found');
    }

    const updatedUser = await this.postModel.findByIdAndUpdate(
      { _id: postId },
      {
        $set: updatePostsDto,
      },
      {
        new: true,
      },
    );

    return updatedUser;
  }

  async delete(postId: string) {
    const deletedResponse = await this.postModel.deleteOne({ _id: postId });

    if (deletedResponse?.deletedCount === 0) {
      throw new NotFoundException('No Post Deleted!');
    }

    return null;
  }

  async getPostAndUserIds() {
    // // Step 1: Aggregate likes count for each post
    // const likesAggregation = await this.reactionModel.aggregate([
    //   {
    //     $match: { type: 'like' }, // Filter only 'like' reactions
    //   },
    //   {
    //     $group: {
    //       _id: '$post', // Group by post ID
    //       likesCount: { $sum: 1 }, // Count number of likes
    //     },
    //   },
    // ]);

    // // Step 2: Update likesCount in each corresponding post
    // for (const like of likesAggregation) {
    //   await this.postModel.updateOne(
    //     { _id: like._id }, // Find the post by ID
    //     { $set: { likesCount: like.likesCount } }, // Update the likesCount
    //   );
    // }

    // await this.postModel.updateMany(
    //   {},
    //   {
    //     $set: {
    //       likesCount: 0,
    //       commentsCount: 0,
    //     },
    //   },
    // );

    const posts = await this.postModel.find({}).select('user likesCount');

    return posts;
  }
}
