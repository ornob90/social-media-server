import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { Bookmark } from 'src/schemas/bookmarks.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectModel(Bookmark.name) private bookmarkModel: Model<Bookmark>,
  ) {}

  async addBookmark(createBookmarkDto: CreateBookmarkDto) {
    const bookmarkInstance = new this.bookmarkModel(createBookmarkDto);
    const bookmark = await bookmarkInstance.save();

    if (!bookmark) {
      throw new InternalServerErrorException('Failed to add bookmark!');
    }

    return bookmark;
  }

  async removeBookmark(bookmarkId: string) {
    const removeResponse =
      await this.bookmarkModel.findByIdAndDelete(bookmarkId);

    if (!removeResponse) {
      throw new NotFoundException('Failed to remove bookmark');
    }

    return null;
  }
}
