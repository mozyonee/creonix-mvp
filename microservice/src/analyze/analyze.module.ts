import { Module } from '@nestjs/common';
import { AnalyzeService } from './analyze.service';
import { AnalyzeController } from './analyze.controller';
import { UploadModule } from './utils/upload/upload.module';

@Module({
	imports: [UploadModule],
	controllers: [AnalyzeController],
	providers: [AnalyzeService],
	exports: [AnalyzeService]
})
export class AnalyzeModule { }