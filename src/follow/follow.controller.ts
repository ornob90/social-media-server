import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { CreateFollowDto } from './dto/create-follow.dto';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post('/add')
  @UsePipes(new ValidationPipe())
  addFollow(@Body() createFollowDto: CreateFollowDto) {
    return this.followService.addFollow(createFollowDto);
  }

  @Delete('/remove/:followId')
  removeFollow(@Param('followId') followId: string) {
    return this.followService.removeFollow(followId);
  }
}
