import * as fsSync from 'fs';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { promisify } from 'util';
import { spawn } from 'child_process';
import * as path from 'path';

@Injectable()
export class UploadService {
	private readonly logger = new Logger(UploadService.name);

	constructor(
		private readonly configService: ConfigService,
	) { }

	async analyze(scriptPath: string): Promise<{
		success: boolean;
		output: string | null;
		errors: string | null;
	}> {
		if (!fsSync.existsSync(scriptPath)) {
			throw new Error(`Script file not found: ${scriptPath}`);
		}

		const aeExecutable = this.configService.getOrThrow<string>('AE_PATH');
		if (!aeExecutable || !fsSync.existsSync(aeExecutable)) {
			throw new Error('Invalid or missing After Effects path in configuration');
		}

		this.logger.log(`After effects executable path: ${aeExecutable}`);
		this.logger.log(`Executing After Effects script: ${scriptPath}`);

		try {
			// Use spawn to execute the process with high priority
			const child = spawn(aeExecutable, ['-m', '-noui', '-r', scriptPath], {
				cwd: path.dirname(aeExecutable),
				stdio: ['ignore', 'pipe', 'pipe'], // Configure stdio for capturing output
			});

			// Set high priority (Windows-specific, adjust for other platforms if needed)
			try {
				const { exec } = require('child_process');
				const execPromise = promisify(exec);
				await execPromise(
					`wmic process where processid=${child.pid} call setpriority "high priority"`,
				);
			} catch (priorityError) {
				this.logger.warn(
					`Failed to set high priority: ${priorityError.message}`,
				);
			}

			let stdout = '';
			let stderr = '';

			// Capture stdout
			child.stdout.on('data', (data) => {
				stdout += data.toString();
				this.logger.log(data.toString());
			});

			// Capture stderr
			child.stderr.on('data', (data) => {
				stderr += data.toString();
			});

			// Wait for the process to exit
			await new Promise<void>((resolve, reject) => {
				// Explicitly type as Promise<void>
				child.on('close', (code) => {
					if (code === 0) {
						resolve(); // No value needed for void
					} else {
						reject(new Error(`Process exited with code ${code}`));
					}
				});
				child.on('error', reject);
			});

			if (stdout) {
				this.logger.log(`Script execution output: ${stdout}`);
			}
			if (stderr) {
				this.logger.warn(`Script execution warnings/errors: ${stderr}`);
			}

			return {
				success: !stderr || !stderr.includes('Error:'),
				output: stdout || null,
				errors: stderr || null,
			};
		} catch (error) {
			this.logger.error(`Error running After Effects script: ${error.message}`);
			return {
				success: false,
				output: null,
				errors: error.message,
			};
		}
	}
}
