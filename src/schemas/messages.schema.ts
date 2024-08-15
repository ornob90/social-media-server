import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './users.schema'; // Assuming User schema is in user.schema.ts

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender is required and must be a valid user ID'],
  })
  sender: Types.ObjectId; // Foreign key to reference User as sender

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
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
