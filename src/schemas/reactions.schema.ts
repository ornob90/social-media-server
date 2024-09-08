import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './users.schema';
import { Post } from './posts.schema';
export type ReactionDocument = Reaction & Document;

@Schema({ timestamps: true })
export class Reaction {
  @Prop({
    type: Types.ObjectId,
    ref: Post.name,
    required: [true, 'Post is required and must be a valid post ID'],
  })
  post: Types.ObjectId; // Foreign key to reference Post

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: [true, 'User ID for Reaction From is required!'],
  })
  reactionFrom: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: [true, 'User ID for Reacted To is required!'],
  })
  reactedTo: Types.ObjectId;

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

// ReactionSchema.post<ReactionDocument>('save', async function () {
//   const PostModel = this.constructor['postModel'] as Model<PostDocument>;

//   if (this.type === ReactionType.LIKE) {
//     await PostModel.findByIdAndUpdate(this.post, { $inc: { likesCount: 1 } });
//   } else if (this.type === ReactionType.COMMENT) {
//     await PostModel.findByIdAndUpdate(this.post, {
//       $inc: { commentsCount: 1 },
//     });
//   } else if (this.type === ReactionType.SHARE) {
//     await PostModel.findByIdAndUpdate(this.post, {
//       $inc: { sharesCount: 1 },
//     });
//   }
// });

// ReactionSchema.post<ReactionDocument>(
//   'findOneAndDelete',
//   async function (doc: ReactionDocument) {
//     const PostModel = model<PostDocument>(Post.name);

//     if (!doc) return;

//     if (doc?.type === ReactionType.LIKE) {
//       await PostModel.findByIdAndDelete(doc?.post, {
//         $inc: { likesCount: -1 },
//       });
//     } else if (doc?.type === ReactionType.COMMENT) {
//       await PostModel.findByIdAndUpdate(doc?.post, {
//         $inc: { commentsCount: -1 },
//       });
//     } else if (doc?.type === ReactionType.SHARE) {
//       await PostModel.findByIdAndUpdate(doc?.post, {
//         $inc: {
//           sharesCount: -1,
//         },
//       });
//     }
//   },
// );
