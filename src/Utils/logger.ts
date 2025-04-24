/*
 * Copyright (c) 2015-2025 TriVir LLC - All Rights Reserved
 *
 *  This software is proprietary and confidential.
 *  Unauthorized copying of this file, via any medium, is strictly prohibited.
 */

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

	public log(message: string, ...args: unknown[]): void {
		if (!this._logsEnabled) return;
		console.log(message);
		for (const arg of args) {
			console.log(JSON.stringify(arg, null, 2));
		}
	}
}
