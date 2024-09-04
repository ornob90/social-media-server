import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ParseObjectId } from 'src/pipes/parse-object-id.pipes';
import { Types } from 'mongoose';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('rooms/:userId')
  getRoomsByUser(
    @Param('userId', ParseObjectId) userId: Types.ObjectId,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.messageService.getRoomsByUser(userId, page, limit);
  }

  @Get(':senderId/:receiverId')
  getMessagesByUser(
    @Param('senderId') senderId: string,
    @Param('receiverId') receiverId: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.messageService.getMessagesByUser(
      senderId,
      receiverId,
      page,
      limit,
    );
  }

  @Post('/add')
  @UsePipes(new ValidationPipe())
  addMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.addMessage(createMessageDto);
  }

  @Put('/remove/:messageId')
  removeMessage(@Param('messageId') messageId: string) {
    this.messageService.removeMessage(messageId);
  }
}
