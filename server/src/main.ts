import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import mongoose from 'mongoose';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cors from 'cors';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);

	mongoose.set('debug', true);

	app.use((req, res, next) => {
		console.log(`Incoming request: ${req.method} ${req.url}`);
		next();
	});

	app.use(
		cors({
			origin: [
				'http://localhost:3000',
				'http://localhost:3001',
				'http://localhost:3002',
			],
			methods: ['GET', 'HEAD', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
			allowedHeaders: [
				'Content-Type',
				'Accept',
				'Authorization',
				'X-Requested-With',
			],
			credentials: true,
		}),
	);

	app.useGlobalPipes(new ValidationPipe());
	app.use(cookieParser());
	app.use(compression());
	app.use(bodyParser.json({ limit: '50mb' }));
	app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

	await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
