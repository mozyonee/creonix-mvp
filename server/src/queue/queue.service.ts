import { Injectable, Logger } from '@nestjs/common';
import { Queue, QueueEvents } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { ANALYZE_PROCESS, AFX_QUEUE } from './constants/queue.constants';
import { ConfigService } from '@nestjs/config';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class QueueService {
	private readonly logger = new Logger(QueueService.name);
	private queueEvents: QueueEvents;

	constructor(
		private readonly configService: ConfigService,
		private readonly notificationsService: NotificationsService,
		@InjectQueue(AFX_QUEUE) private readonly afxQueue: Queue,

	) {
		this.setupQueueEvents();
	}
	private setupQueueEvents() {
		this.queueEvents = new QueueEvents(AFX_QUEUE, {
			connection: {
				host: this.configService.getOrThrow<string>('REDIS_HOST'),
				port: this.configService.get<number>('REDIS_PORT', 6379),
			},
		});

		this.queueEvents.on('progress', async ({ jobId, data }) => {
			const job = await this.afxQueue.getJob(jobId);
			if (job.name !== ANALYZE_PROCESS) return;

			this.logger.log(`Job ${jobId} progress: ${data}%`);
		});

		this.queueEvents.on('completed', async ({ jobId }) => {
			const job = await this.afxQueue.getJob(jobId);
			if (job.name !== ANALYZE_PROCESS) return;

			try {
				this.notificationsService.create(`job ${jobId} completed`);
			} catch (error) {
				this.logger.error(`Error processing completed job ${jobId}:`, error);
			}
		});

		this.queueEvents.on('failed', async ({ jobId, failedReason }) => {
			const job = await this.afxQueue.getJob(jobId);
			if (job.name !== ANALYZE_PROCESS) return;

			try {
				this.notificationsService.create(`job ${jobId} failed`);
			} catch (error) {
				this.logger.error(`Error processing failed job ${jobId}:`, error);
			}

			this.logger.error(`Job ${jobId} failed:`, failedReason);
		});

		this.queueEvents.on('active', async ({ jobId }) => {
			const job = await this.afxQueue.getJob(jobId);
			if (job.name !== ANALYZE_PROCESS) return;

			this.logger.log(`Job ${jobId} started`);
		});
	}

	async create() {
		const job = await this.afxQueue.add(ANALYZE_PROCESS, {});

		this.logger.log(`Job added to queue with ID: ${job.id}`);
		return job.id;
	}

	async get(id: string) {
		return await this.afxQueue.getJob(id);
	}

}
