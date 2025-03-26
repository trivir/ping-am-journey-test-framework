import { loadConfig } from "../config";

export class Logger {
	private static _instance: Logger;
	private _logsEnabled = false;

	private constructor() {}

	public static getInstance(): Logger {
		if (!Logger._instance) {
			Logger._instance = new Logger();
			const { DEBUG_LOGS } = loadConfig();
			Logger._instance._logsEnabled = DEBUG_LOGS;
		}
		return Logger._instance;
	}

	public log(message: string): void {
		if (!this._logsEnabled) return;
		const timestamp = new Date().toLocaleTimeString();
		console.log(`[${timestamp}] ${message}`);
	}

	public info(message: string): void {
		this.log(`INFO: ${message}`);
	}

	public warn(message: string): void {
		this.log(`WARN: ${message}`);
	}

	public error(message: string, error?: Error): void {
		this.log(`ERROR: ${message}`);
		if (error) {
			console.error(error);
		}
	}
}
