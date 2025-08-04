import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisService } from './redis/redis.service';
import { RedisModule } from './redis/redis.module';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsModule } from './notifications/notifications.module';
import { QueueModule } from './queue/queue.module';
import { TelegramModule } from './telegram/telegram.module';

@Module({
	imports: [
		BullModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				connection: {
					host: configService.getOrThrow<string>('REDIS_HOST'),
					port: configService.get<number>('REDIS_PORT', 6379),
				},
			}),
			inject: [ConfigService]
		}),
		ConfigModule.forRoot({ isGlobal: true }),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => {
				const mongoUri = configService.getOrThrow<string>('MONGODB_URI');
				return ({
					uri: mongoUri,
				});
			},
			inject: [ConfigService],
		}),
		RedisModule,
		NotificationsModule,
		QueueModule,
		TelegramModule,
	],
	controllers: [AppController],
	providers: [AppService, RedisService],
})
export class AppModule { }
