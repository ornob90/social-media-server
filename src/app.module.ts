import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { mongodbConfig } from './config/mongodb.config';
import { MongooseModule } from '@nestjs/mongoose';
import { VerifyMiddleware } from './middlewares/verify.middleware';
import { PostsController } from './posts/posts.controller';
import { ReactionsModule } from './reactions/reactions.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { FollowModule } from './follow/follow.module';
import { NotificationModule } from './notification/notification.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    MongooseModule.forRoot(mongodbConfig.uri, {
      dbName: 'wavechat',
    }),
    UsersModule,
    PostsModule,
    ReactionsModule,
    BookmarksModule,
    FollowModule,
    NotificationModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyMiddleware).forRoutes(PostsController);
  }
}
