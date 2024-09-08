import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './users.schema';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: [true, 'User is required and must be a valid user ID'],
  })
  user: Types.ObjectId; // Foreign key to reference User

  @Prop({
    type: Types.ObjectId,
    ref: 'Post',
  })
  sharedPostId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
  })
  sharedBy: Types.ObjectId;

  @Prop({
    required: [true, 'Content is required'],
    minlength: [1, 'Content must be at least 1 character long'],
  })
  content: string;

  @Prop({
    type: [String],
    validate: {
      validator: function (value: string[]) {
        return value.length <= 10; // Example: Allow up to 10 images
      },
      message: 'You can upload a maximum of 10 images',
    },
  })
  images: string[];

  @Prop({
    enum: {
      values: ['public', 'private'],
      message: 'Privacy must be either public or private',
    },
    default: 'public',
  })
  privacy: string;

  @Prop({ type: Number, default: 0 })
  likesCount: number;

  @Prop({ type: Number, default: 0 })
  commentsCount: number;

  @Prop({ type: Number, default: 0 })
  sharesCount: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);
