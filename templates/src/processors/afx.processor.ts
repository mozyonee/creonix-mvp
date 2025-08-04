import { AnalyzeService } from '../analyze/analyze.service';
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { ANALYZE_PROCESS, AFX_QUEUE } from "../constants/afx.constants";
import { Job } from "bullmq";

@Processor(AFX_QUEUE)
export class AfxProcessor extends WorkerHost {
	constructor(
		private readonly analyzeService: AnalyzeService,
	) {
		super();
	}

	async process(job: Job<any>): Promise<any> {
		switch (job.name) {
			case ANALYZE_PROCESS: {
				const result = await this.analyzeService.handleAnalyzeProcess(job);
				return { process: ANALYZE_PROCESS, ...result };
			}
			default: {
				throw new Error(`Unknown job type: ${job.name}`);
			}
		}
	}
}