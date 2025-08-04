import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
	constructor(private readonly telegramService: TelegramService) { }

	@Post()
	async sendMessage(@Body() body: { telegramId: string, message: string; }) {
		const { telegramId, message } = body;
		return await this.telegramService.sendMessage(+telegramId, message);
	}

	@Get()
	async testConnection() {
		return await this.telegramService.testConnection();
	}
}