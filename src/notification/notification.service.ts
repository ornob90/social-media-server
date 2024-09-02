import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from 'src/schemas/notifications.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
  ) {}

  async addNotification(createNotificationDto: CreateNotificationDto) {
    const notificationInstance = new this.notificationModel(
      createNotificationDto,
    );
    const notification = await notificationInstance.save();

    if (!notification) {
      throw new InternalServerErrorException('Failed to add notification!');
    }

    return notification;
  }

  async markAsSeen(notificationId: string) {
    const updateResponse = await this.notificationModel.findByIdAndUpdate(
      notificationId,
      {
        isViewed: true,
      },
      {
        new: true,
      },
    );

    if (!updateResponse) {
      throw new NotFoundException('No Notification Found!');
    }

    return updateResponse;
  }

  async removeNotification(notificationId: string) {
    const removeResponse =
      await this.notificationModel.findByIdAndDelete(notificationId);

    if (!removeResponse) {
      throw new NotFoundException('Failed to remove notification');
    }

    return null;
  }
}
