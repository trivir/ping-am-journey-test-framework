/*
 * Copyright (c) 2015-2025 TriVir LLC - All Rights Reserved
 *
 *  This software is proprietary and confidential.
 *  Unauthorized copying of this file, via any medium, is strictly prohibited.
 */

import * as fs from "node:fs/promises";
import type { ClientConfig } from "../Types";
import { loadConfig } from "../config";
import { getToken } from "./authenticate";

export class AMInstance {
	private _baseURL: string;
	private _authStrategy: AuthStrategy | null = null;

	constructor(baseURL: string, authStrategy?: AuthStrategy) {
		this._baseURL = baseURL;
		this._authStrategy = authStrategy ?? null;
	}

	public get baseURL() {
		return this._baseURL;
	}

	public get authHeader() {
		if (!this._authStrategy) {
			throw new Error(
				"No auth strategy was provided when creating the AmInstance",
			);
		}
		return this._authStrategy.getAuthHeader(this);
	}
}

interface AuthStrategy {
	getAuthHeader(amInstance: AMInstance): Promise<{ [key: string]: string }>;
}

export class CloudServiceAccountAuthStrategy {
	async getAuthHeader(
		amInstance: AMInstance,
	): Promise<{ [key: string]: string }> {
		const clientConfig = await getClientConfig();

		if (!clientConfig) {
			throw new Error("There was a problem with the config to authenticate");
		}

		const jwt = await getToken(amInstance.baseURL, clientConfig);

		return { Authorization: `Bearer ${jwt}` };
	}
}

async function getClientConfig(): Promise<ClientConfig | null> {
	try {
		const {
			SERVICE_ACCOUNT_CLIENT_ID,
			SERVICE_ACCOUNT_ID,
			SERVICE_ACCOUNT_SCOPE,
			SERVICE_ACCOUNT_JWK_PATH,
		} = loadConfig();

		const privateKey = await fs.readFile(SERVICE_ACCOUNT_JWK_PATH, "utf-8");
		return {
			clientId: SERVICE_ACCOUNT_CLIENT_ID,
			jwtIssuer: SERVICE_ACCOUNT_ID,
			scope: SERVICE_ACCOUNT_SCOPE,
			privateKey,
		};
	} catch (err) {
		console.error("There was a problem with the config to authenticate", err);
		return null;
	}
}
