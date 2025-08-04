import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import { Job } from 'bullmq';
import { UploadService } from './utils/upload/upload.service';

@Injectable()
export class AnalyzeService {
	private readonly logger = new Logger(AnalyzeService.name);

	constructor(
		private readonly uploadService: UploadService,
	) { }

	async handleAnalyzeProcess(job: Job): Promise<any> {
		this.logger.log(`Processing job: ${job.id}`);

		job.updateProgress(15);

		const scriptPath = path.join(
			process.cwd(),
			'assets',
			'scripts',
			'analyze.jsx',
		);

		job.updateProgress(25);

		await this.uploadService.analyze(scriptPath);

		job.updateProgress(75);

		this.logger.log(`Job complete: ${job.id}`);
		return `${job.id} succeeded`;
	}
}
