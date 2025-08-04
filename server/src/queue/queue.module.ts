import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { BullModule } from '@nestjs/bullmq';
import { AFX_QUEUE } from './constants/queue.constants';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
	imports: [
		BullModule.registerQueue({
			name: AFX_QUEUE,
		}),
		NotificationsModule
	],
	controllers: [QueueController],
	providers: [QueueService],
})

export class QueueModule { }