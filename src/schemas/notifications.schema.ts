import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { User } from './users.schema';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: [true, 'User is required and must be a valid user ID'],
  })
  userId: Types.ObjectId;

  @Prop({
    required: [true, 'Content is required for the notification'],
    minlength: [1, 'Notification content must be at least 1 character long'],
  })
  content: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  isViewed: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
