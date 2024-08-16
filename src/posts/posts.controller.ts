import {
  Body,
  Controller,
  Post,
  Put,
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
}
