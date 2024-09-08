import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { ReactionType } from 'src/types/reactions.types';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ValidatePromise } from 'class-validator';

@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionService: ReactionsService) {}

  @Get('comments/:postId')
  getPaginatedComments(
    // @Param('userId') userId: string,
    @Param('postId') postId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.reactionService.getPaginatedComments(
      // userId,
      postId,
      page,
      limit,
    );
  }

  @Post('create')
  @UsePipes(new ValidationPipe())
  createReaction(@Body() createReactionDto: CreateReactionDto) {
    return this.reactionService.createReaction(createReactionDto);
  }

  @Put('update/comment/:postId/:reactionFrom/:reactedTo')
  @UsePipes(new ValidationPipe())
  updateComment(
    @Param('postId') postId: string,
    @Param('reactionFrom') reactionFrom: string,
    @Param('reactedTo') reactedTo: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.reactionService.updateComment(
      postId,
      reactionFrom,
      reactedTo,
      updateCommentDto,
    );
  }

  @Delete('remove/:type/:postId/:reactionFrom/:reactedTo')
  removeReaction(
    @Param('type') type: ReactionType,
    @Param('postId') postId: string,
    @Param('reactionFrom') reactionFrom: string,
    @Param('reactedTo') reactedTo: string,
  ) {
    return this.reactionService.removeReaction(
      type,
      postId,
      reactionFrom,
      reactedTo,
    );
  }
}
