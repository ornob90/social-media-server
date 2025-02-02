import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: [true, 'Username is required'],
    unique: true,
    minlength: [3, 'Username must be at least 3 characters long'],
  })
  userName: string;

  @Prop({
    required: [true, 'Display Name is required'],
    minlength: [3, 'Display Name must be at least 3 characters long'],
  })
  displayName: string;

  @Prop({
    required: [true, 'Email is required'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  })
  email: string;

  @Prop({
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  })
  password: string;

  @Prop({
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
  })
  phone?: string;

  @Prop({
    maxlength: [150, 'Bio cannot be longer than 150 characters'],
  })
  bio?: string;

  @Prop({ default: null })
  photoUrl?: string;

  @Prop({ default: 'inactive', enum: ['active', 'inactive'] })
  status: string;

  @Prop({
    enum: ['Everyone', 'Friends'],
    default: 'Everyone',
  })
  commentAccess: string;

  @Prop({
    enum: ['Everyone', 'Friends'],
    default: 'Everyone',
  })
  postViewAccess: string;

  @Prop({
    enum: ['Everyone', 'Friends'],
    default: 'Everyone',
  })
  friendRequestAccess: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
