import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-posts.dto';
import { VerifiedRequestInterface } from 'src/types/middleware.types';
import { UpdatePostsDto } from './dto/update-posts.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('all/:userId')
  @UsePipes(new ValidationPipe())
  getAllPosts(
    @Param('userId') userId: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.postsService.getAllPosts(userId, page, limit);
  }

  @Get('owner/:userId')
  @UsePipes(new ValidationPipe())
  getPostsByUser(
    @Param('userId') userId: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.postsService.getPostsByUser(userId, page, limit);
  }

  @Get('owner/:userId/:postId')
  getPostDetails(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ) {
    return this.postsService.getPostDetails(userId, postId);
  }

  @Post('/create')
  @UsePipes(new ValidationPipe())
  create(
    @Req() req: VerifiedRequestInterface,
    @Body() createPostsDto: CreatePostDto,
  ) {
    return this.postsService.create(req, createPostsDto);
  }

  @Put('/update')
  @UsePipes(new ValidationPipe())
  update(
    @Req() req: VerifiedRequestInterface,
    @Body() updatePostsDto: UpdatePostsDto,
  ) {
    return this.postsService.update(req, updatePostsDto);
  }

  @Delete('/delete/:postId')
  delete(@Param('postId') postId: string) {
    return this.postsService.delete(postId);
  }

  @Get('user-post-ids')
  getPostAndUserIds() {
    return this.postsService.getPostAndUserIds();
  }
}
