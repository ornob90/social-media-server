import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { User } from './users.schema';
import { Post } from './posts.schema';

@Schema({ timestamps: true })
export class Bookmark {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: [true, 'User ID is required!'],
  })
  userId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Post.name,
    required: [true, 'Post ID is required!'],
  })
  postId: string;
}

export const BookmarkSchema = SchemaFactory.createForClass(Bookmark);
