/*
 * Copyright (c) 2015-2025 TriVir LLC - All Rights Reserved
 *
 *  This software is proprietary and confidential.
 *  Unauthorized copying of this file, via any medium, is strictly prohibited.
 */

import { cosmiconfigSync } from "cosmiconfig";

interface LibraryConfig {
	BASE_URL: string;
	REALM: string;
	SERVICE_ACCOUNT_ID: string;
	SERVICE_ACCOUNT_CLIENT_ID: string;
	SERVICE_ACCOUNT_SCOPE: string;
	SERVICE_ACCOUNT_JWK_PATH: string;
	COOKIE_NAME: string;
	GMAIL: string;
	GMAIL_APP_PASSWORD: string;
	DEBUG_LOGS: boolean;
}

export function loadConfig() {
	const explorer = cosmiconfigSync("ping-aic-lib-ts", {
		searchStrategy: "global",
		searchPlaces: ["ping-aic-lib-ts.config.json"],
	});
	const result = explorer.search();

	if (!result) {
		throw new Error("ping-aic-lib-ts.config.json config file not found.");
	}

	const config: LibraryConfig = result ? result.config : {};

	return config;
}
