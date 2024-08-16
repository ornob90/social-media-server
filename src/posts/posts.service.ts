import { BadRequestException, Injectable } from '@nestjs/common';
import { VerifiedRequestInterface } from 'src/types/middleware.types';
import { CreatePostDto } from './dto/create-posts.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from 'src/schemas/posts.schema';
import { Model } from 'mongoose';
import { UpdatePostsDto } from './dto/update-posts.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async create(req: VerifiedRequestInterface, createPostsDto: CreatePostDto) {
    const { _id: userId } = req.user;

    createPostsDto.user = userId;

    const postInstance = new this.postModel(createPostsDto);
    const post = await postInstance.save();

    return post;
  }

  async update(req: VerifiedRequestInterface, updatePostsDto: UpdatePostsDto) {
    const { _id: userId } = req.user;
    updatePostsDto.user = userId;

    const { postId } = updatePostsDto;

    delete updatePostsDto.postId;

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
}
