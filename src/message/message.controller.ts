import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

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
