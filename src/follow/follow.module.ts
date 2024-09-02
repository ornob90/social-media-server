import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Follower, FollowerSchema } from 'src/schemas/follows.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Follower.name, schema: FollowerSchema },
    ]),
  ],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule {}
