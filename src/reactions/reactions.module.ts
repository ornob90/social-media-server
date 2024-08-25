import { Module } from '@nestjs/common';
import { ReactionsController } from './reactions.controller';
import { ReactionsService } from './reactions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Reaction, ReactionSchema } from 'src/schemas/reactions.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reaction.name, schema: ReactionSchema },
    ]),
  ],
  controllers: [ReactionsController],
  providers: [ReactionsService],
})
export class ReactionsModule {}
