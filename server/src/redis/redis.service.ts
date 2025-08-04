import {
	Injectable,
	OnModuleInit,
	OnModuleDestroy,
	Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
	private client: RedisClientType;
	private readonly logger = new Logger(RedisService.name);

	constructor(private readonly configService: ConfigService) {
		this.client = createClient({
			socket: {
				host: this.configService.getOrThrow<string>('REDIS_HOST'),
				port: this.configService.get<number>('REDIS_PORT', 6379),
				connectTimeout: 10000,
			},
			//  /////////password: this.configService.getOrThrow<string>('REDIS_PASSWORD'), // Optional password
		});

		this.client.on('error', (error) => {
			this.logger.error('Redis connection error:', error);
		});

		this.client.on('connect', () => {
			this.logger.log('Connected to Redis');
		});

		this.client.on('ready', () => {
			this.logger.log('Redis client ready');
		});

		this.client.on('end', () => {
			this.logger.log('Redis connection ended');
		});
	}

	async onModuleInit() {
		try {
			await this.client.connect();
			this.logger.log('Redis client connected successfully');
		} catch (error) {
			this.logger.error('Failed to connect to Redis:', error);
			throw new Error('Redis connection failed');
		}
	}

	async onModuleDestroy() {
		try {
			await this.client.quit();
			this.logger.log('Redis client disconnected');
		} catch (error) {
			this.logger.error('Error disconnecting from Redis:', error);
		}
	}

	async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
		if (ttlSeconds) {
			await this.client.setEx(key, ttlSeconds, value);
		} else {
			await this.client.set(key, value);
		}
	}

	async get(key: string): Promise<string | null> {
		return await this.client.get(key);
	}

	async del(key: string): Promise<void> {
		await this.client.del(key);
	}

	async exists(key: string): Promise<boolean> {
		return (await this.client.exists(key)) === 1;
	}
}
