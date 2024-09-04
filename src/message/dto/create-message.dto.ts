import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMessageDto {
  roomId?: string;

  @IsNotEmpty({ message: 'Sender ID is required!' })
  sender: string;

  @IsNotEmpty({ message: 'Receiver ID is required!' })
  receiver: string;

  @IsNotEmpty({ message: 'Message is required!' })
  message: string;
}
