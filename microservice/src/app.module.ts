import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnalyzeModule } from './analyze/analyze.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import path, { extname } from 'path';
import { diskStorage } from 'multer';
import { AFX_QUEUE } from './constants/afx.constants';
import { AfxProcessor } from './processors/afx.processor';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		BullModule.registerQueue({
			name: AFX_QUEUE,
		}),
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
		MulterModule.register({
			storage: diskStorage({
				destination: './uploads',
				filename: (req, file, callback) => {
					const uniqueSuffix =
						Date.now() + '-' + Math.round(Math.random() * 1e9);
					const ext = extname(file.originalname);
					callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
				},
			}),
			fileFilter: (req, file, callback) => {
				const allowedExtensions = ['.zip', '.rar', '.7z'];
				const fileExtension = path.extname(file.originalname).toLowerCase();

				if (!allowedExtensions.includes(fileExtension)) {
					return callback(
						new Error('Only ZIP, RAR, and 7Z files are allowed!'),
						false,
					);
				}
				callback(null, true);
			},
			// limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
		}),
		AnalyzeModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		AfxProcessor
	],
})
export class AppModule { }
