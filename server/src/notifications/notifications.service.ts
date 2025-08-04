import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
	constructor(
		@InjectModel(Notification.name) private notificationModel: Model<Notification>,
	) { }

	async create(text: string) {
		return await this.notificationModel.create({ text });
	}

	async findAll() {
		return await this.notificationModel.find();
	}
}
