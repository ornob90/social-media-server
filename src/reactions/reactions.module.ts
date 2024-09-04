import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { ReactionsController } from './reactions.controller';
import { ReactionsService } from './reactions.service';
import { Reaction } from 'src/schemas/reactions.schema';
import { Post, PostDocument, PostSchema } from 'src/schemas/posts.schema';
import { Model } from 'mongoose';
import { PostsModule } from 'src/posts/posts.module';
import { reactionSchemaFactory } from './reactions.filters';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeatureAsync([
      {
        name: Reaction.name,
        imports: [PostsModule],
        useFactory: (postModel: Model<PostDocument>) =>
          reactionSchemaFactory(postModel),
        inject: [getModelToken(Post.name)],
      },
    ]),
  ],
  controllers: [ReactionsController],
  providers: [ReactionsService],
})
export class ReactionsModule {}

// import { Module } from '@nestjs/common';
// import { ReactionsController } from './reactions.controller';
// import { ReactionsService } from './reactions.service';
// import { getModelToken, MongooseModule } from '@nestjs/mongoose';
// import {
//   Reaction,
//   ReactionDocument,
//   ReactionSchema,
// } from 'src/schemas/reactions.schema';
// import { Post, PostDocument, PostSchema } from 'src/schemas/posts.schema';
// import { PostsModule } from 'src/posts/posts.module';
// import { Model } from 'mongoose';
// import { ReactionType } from 'src/types/reactions.types';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
//     MongooseModule.forFeatureAsync([
//       {
//         name: Reaction.name,
//         useFactory: (postModel: Model<PostDocument>) => {
//           // Add middleware to increment counts on save
//           ReactionSchema.post('save', async function (doc: ReactionDocument) {
//             console.log({ type: doc.type, post: doc.post });

//             if (doc.type === ReactionType.LIKE) {
//               await postModel.findByIdAndUpdate(doc.post, {
//                 $inc: { likesCount: 1 },
//                 $set: {
//                   privacy: 'private',
//                 },
//               });
//             } else if (doc.type === ReactionType.COMMENT) {
//               await postModel.findByIdAndUpdate(doc.post, {
//                 $inc: { commentsCount: 1 },
//               });
//             } else if (doc.type === ReactionType.SHARE) {
//               await postModel.findByIdAndUpdate(doc.post, {
//                 $inc: { sharesCount: 1 },
//               });
//             }
//           });

//           // Add middleware to decrement counts on findOneAndDelete
//           ReactionSchema.post(
//             'findOneAndDelete',
//             async function (doc: ReactionDocument) {
//               if (doc.type === 'like') {
//                 await postModel.findByIdAndUpdate(doc.post, {
//                   $inc: { likesCount: -1 },
//                 });
//               } else if (doc.type === 'comment') {
//                 await postModel.findByIdAndUpdate(doc.post, {
//                   $inc: { commentsCount: -1 },
//                 });
//               } else if (doc.type === 'share') {
//                 await postModel.findByIdAndUpdate(doc.post, {
//                   $inc: { sharesCount: -1 },
//                 });
//               }
//             },
//           );
//         },
//         inject: [getModelToken(Post.name)],
//       },
//     ]),
//   ],
//   controllers: [ReactionsController],
//   providers: [ReactionsService],
// })
// export class ReactionsModule {}
