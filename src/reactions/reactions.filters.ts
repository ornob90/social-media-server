import { ReactionDocument, ReactionSchema } from 'src/schemas/reactions.schema';
import { PostDocument } from 'src/schemas/posts.schema';
import { Model } from 'mongoose';
import { ReactionType } from 'src/types/reactions.types';

export const reactionSchemaFactory = async (postModel: Model<PostDocument>) => {
  ReactionSchema.post('save', async function (doc: ReactionDocument) {
    console.log({ type: doc.type, post: doc.post });

    if (doc.type === ReactionType.LIKE) {
      await postModel.findOneAndUpdate(
        { _id: doc.post },
        {
          $inc: { likesCount: 1 },
        },
      );
    } else if (doc.type === ReactionType.COMMENT) {
      await postModel.findOneAndUpdate(
        { _id: doc.post },
        {
          $inc: { commentsCount: 1 },
        },
      );
    } else if (doc.type === ReactionType.SHARE) {
      await postModel.findOneAndUpdate(
        { _id: doc.post },
        {
          $inc: { sharesCount: 1 },
        },
      );
    }
  });

  ReactionSchema.post(
    'findOneAndDelete',
    async function (doc: ReactionDocument) {
      if (doc.type === ReactionType.LIKE) {
        await postModel.findByIdAndUpdate(doc.post, {
          $inc: { likesCount: -1 },
        });
      } else if (doc.type === ReactionType.COMMENT) {
        await postModel.findByIdAndUpdate(doc.post, {
          $inc: { commentsCount: -1 },
        });
      } else if (doc.type === ReactionType.SHARE) {
        await postModel.findByIdAndUpdate(doc.post, {
          $inc: { sharesCount: -1 },
        });
      }
    },
  );

  return ReactionSchema;
};
