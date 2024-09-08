import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { User } from './users.schema'; // Assuming User schema is in users.schema.ts
import { RoomType } from 'src/types/rooms.type';

export type RoomDocument = Room & Document;

@Schema({ timestamps: true })
export class Room {
  @Prop({
    type: String,
    enum: [RoomType.SINGLE, RoomType.GROUP],
    required: [true, 'Room type is required'],
  })
  type: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    validate: [
      (val: Types.ObjectId[]) => val.length > 1,
      'There must be at least two participants in a room',
    ],
    required: [true, 'Participants are required'],
  })
  participants: Types.ObjectId[]; // Array of participant user IDs
}

export const RoomSchema = SchemaFactory.createForClass(Room);
