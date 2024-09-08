// src/users/dto/create-user.dto.ts
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  userName: string;

  @IsString()
  @IsNotEmpty({ message: 'Display Name is required' })
  @MinLength(3, { message: 'Display Name must be at least 3 characters long' })
  displayName: string;

  @IsEmail({}, { message: 'Please enter a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d{10}$/, {
    message: 'Please enter a valid 10-digit phone number',
  })
  phone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(150, { message: 'Bio cannot be longer than 150 characters' })
  bio?: string;

  @IsString()
  @IsOptional()
  photoUrl?: string;

  @IsEnum(['Everyone', 'Friends'], {
    message: 'Comment Access can only be "Everyone" or "Friends"',
  })
  @IsOptional()
  commentAccess?: string;

  @IsEnum(['Everyone', 'Friends'], {
    message: 'Post View Access can only be "Everyone" or "Friends"',
  })
  @IsOptional()
  postViewAccess?: string;

  @IsEnum(['Everyone', 'Friends'], {
    message: 'Friend Request Access can only be "Everyone" or "Friends"',
  })
  @IsOptional()
  friendRequestAccess?: string;
}
