import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QueueService } from './queue.service';

@Controller('queue')
export class QueueController {
	constructor(private readonly queueService: QueueService) { }

	@Post()
	async create() {
		return await this.queueService.create();
	}

	@Get(':id')
	async get(@Param('id') id: string) {
		return await this.queueService.get(id);
	}
}
