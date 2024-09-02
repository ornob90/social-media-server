import { IsNotEmpty } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty({ message: 'User ID is required!' })
  userId: string;

  @IsNotEmpty({ message: 'Notification Content is Required!' })
  content: string;
}
