import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { mongodbConfig } from './config/mongodb.config';
import { MongooseModule } from '@nestjs/mongoose';
import { VerifyMiddleware } from './middlewares/verify.middleware';
import { PostsController } from './posts/posts.controller';

@Module({
  imports: [
    MongooseModule.forRoot(mongodbConfig.uri, {
      dbName: 'wavechat',
    }),
    UsersModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyMiddleware).forRoutes(PostsController);
  }
}
