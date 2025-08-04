import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class TelegramService {

	private bot: AxiosInstance;
	private readonly logger = new Logger(TelegramService.name);

	constructor(
		private readonly configService: ConfigService,
	) {
		this.bot = axios.create({
			baseURL: this.configService.getOrThrow<string>('BOT_URL'),
			withCredentials: true,
			headers: {
				Authorization: `Bearer ${this.configService.getOrThrow<string>('BOT_API_TOKEN')}`,
				'Content-Type': 'application/json',
			},
		});
	}

	async sendMessage(user_id: number, message: string) {
		const result = await this.bot.post(`/send-message`, { user_id, message });
		return result.data;
	}

	async testConnection() {
		const result = await this.bot.get(`/redis-status`);
		return result.data;
	}

}
