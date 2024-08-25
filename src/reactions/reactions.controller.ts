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

@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionService: ReactionsService) {}

  @Get('comments/:userId/:postId')
  getPaginatedComments(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.reactionService.getPaginatedComments(
      userId,
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

  @Delete('remove/:userId/:postId')
  removeReaction(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ) {
    return this.reactionService.removeReaction(userId, postId);
  }
}
