import { Controller } from '@nestjs/common';
import { AnalyzeService } from './analyze.service';

@Controller()
export class AnalyzeController {
  constructor(private readonly analyzeService: AnalyzeService) {}
}
