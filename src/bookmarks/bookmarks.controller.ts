import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarkService: BookmarksService) {}

  @Post('/add')
  @UsePipes(new ValidationPipe())
  addBookmark(@Body() createBookmarkDto: CreateBookmarkDto) {
    return this.bookmarkService.addBookmark(createBookmarkDto);
  }

  @Delete('/remove/:bookmarkId')
  removeBookmark(@Param('bookmarkId') bookmarkId: string) {
    return this.bookmarkService.removeBookmark(bookmarkId);
  }
}
