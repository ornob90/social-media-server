import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { User } from './users.schema';
import { Room } from './rooms.schema';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Room.name,
    required: [true, 'Room Id is required!'],
  })
  roomId: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: [true, 'Sender is required and must be a valid user ID'],
  })
  sender: Types.ObjectId; // Foreign key to reference User as sender

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: [true, 'Receiver is required and must be a valid user ID'],
  })
  receiver: Types.ObjectId; // Foreign key to reference User as receiver

  @Prop({
    required: [true, 'Message content is required'],
    minlength: [1, 'Message cannot be empty'],
  })
  message: string; // Text message content

  @Prop({
    type: Boolean,
    default: false,
  })
  isViewed: boolean; // Boolean to indicate if the message has been viewed
}

export const MessageSchema = SchemaFactory.createForClass(Message);
