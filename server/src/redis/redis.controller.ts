import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RedisService } from './redis.service';

@Controller('redis')
export class RedisController {
	constructor(private readonly redisService: RedisService) { }

	@Post()
	async creteKey(@Body() body: { key: string; value: string; }) {
		const { key, value } = body;
		return await this.redisService.set(key, value);
	}

	@Get(':key')
	async getKey(@Param('key') key: string) {
		const value = await this.redisService.get(key);

		return { key, value };
	}
}
