import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './users.schema'; // Assuming User schema is in user.schema.ts

export type FollowerDocument = Follower & Document;

@Schema({ timestamps: true })
export class Follower {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: [true, 'Following user is required and must be a valid user ID'],
  })
  following: Types.ObjectId; // Foreign key referencing the user being followed

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: [true, 'Follower user is required and must be a valid user ID'],
  })
  follower: Types.ObjectId; // Foreign key referencing the user who is following
}

export const FollowerSchema = SchemaFactory.createForClass(Follower);
