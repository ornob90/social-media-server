import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  userName: string;

  @Prop({ required: true })
  displayName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ unique: true })
  phone: string;

  @Prop({ maxlength: 150 })
  bio: string;

  @Prop()
  photo: string;

  @Prop({ enum: ['Everyone', 'Friends'], default: 'Everyone' })
  commentAccess: string;

  @Prop({ enum: ['Everyone', 'Friends'], default: 'Everyone' })
  postViewAccess: string;

  @Prop({ enum: ['Everyone', 'Friends'], default: 'Everyone' })
  friendRequestAccess: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
