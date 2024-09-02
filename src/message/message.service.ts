import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from 'src/schemas/messages.schema';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async addMessage(createMessageDto: CreateMessageDto) {
    const messageInstance = new this.messageModel(createMessageDto);

    const message = await messageInstance.save();

    if (!message) {
      throw new InternalServerErrorException('Failed to save message');
    }

    return message;
  }

  async removeMessage(messageId: string) {
    const removeResponse = await this.messageModel.findByIdAndDelete(messageId);

    if (removeResponse) {
      throw new NotFoundException('Failed to remove message');
    }

    return null;
  }
}
