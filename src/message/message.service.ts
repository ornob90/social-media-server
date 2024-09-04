import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message } from 'src/schemas/messages.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { Room } from 'src/schemas/rooms.schema';
import { User } from 'src/schemas/users.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(Room.name) private roomModel: Model<Room>,
  ) {}

  async getRoomsByUser(userId: Types.ObjectId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const rooms = await this.messageModel.aggregate([
        {
          $match: {
            $or: [{ sender: userId }, { receiver: userId }],
          },
        },
        {
          $group: {
            _id: '$roomId',
            lastMessage: { $last: '$$ROOT' },
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ]);

      await this.messageModel.populate(rooms, {
        path: 'lastMessage.sender lastMessage.receiver',
        model: User.name,
        select: 'displayName photoUrl',
      });

      return rooms;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getMessagesByUser(
    senderId: string,
    receiverId: string,
    page = 1,
    limit = 10,
  ) {
    const skip = (page - 1) * limit;
    const messages = await this.messageModel
      .find({
        sender: senderId,
        receiver: receiverId,
      })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'sender',
        select: 'displayName photoUrl email',
      })
      .populate({
        path: 'receiver',
        select: 'displayName photoUrl email',
      });

    if (!messages) {
      throw new NotFoundException('No Messages Found!');
    }

    return messages;
  }

  async addMessage(createMessageDto: CreateMessageDto) {
    if (!createMessageDto?.roomId) {
      const roomInstance = new this.roomModel({
        type: 'single',
        participants: [createMessageDto.sender, createMessageDto.receiver],
      });

      const room = await roomInstance.save();
      createMessageDto.roomId = room?._id?.toString();
    }

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
