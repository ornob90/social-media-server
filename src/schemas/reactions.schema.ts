import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './users.schema'; // Assuming User schema is in user.schema.ts
import { Post } from './posts.schema'; // Assuming Post schema is in post.schema.ts

export type ReactionDocument = Reaction & Document;

@Schema({ timestamps: true })
export class Reaction {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required and must be a valid user ID'],
  })
  user: Types.ObjectId; // Foreign key to reference User

  @Prop({
    type: Types.ObjectId,
    ref: 'Post',
    required: [true, 'Post is required and must be a valid post ID'],
  })
  post: Types.ObjectId; // Foreign key to reference Post

  @Prop({
    enum: {
      values: ['like', 'comment', 'share'],
      message: 'Type must be either like, comment, or share',
    },
    required: [true, 'Reaction type is required'],
  })
  type: string;

  @Prop({
    required: [
      function () {
        return this.type === 'comment';
      },
      'Content is required if the reaction type is comment',
    ],
  })
  content: string;
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);
