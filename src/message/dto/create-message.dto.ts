import { IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty({ message: 'Sender ID is required!' })
  sender: string;

  @IsNotEmpty({ message: 'Receiver ID is required!' })
  receiver: string;

  @IsNotEmpty({ message: 'Message is required!' })
  message: string;
}
