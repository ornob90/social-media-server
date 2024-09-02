import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('/add')
  @UsePipes(new ValidationPipe())
  addNotification(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.addNotification(createNotificationDto);
  }

  @Put('/mark-as-seen/:notificationId')
  markAsSeen(@Param('notificationId') notificationId: string) {
    return this.notificationService.markAsSeen(notificationId);
  }

  @Delete('/remove/:notificationId')
  removeNotification(@Param('notificationId') notificationId: string) {
    return this.notificationService.removeNotification(notificationId);
  }
}
