/*
 * Copyright (c) 2015-2025 TriVir LLC - All Rights Reserved
 *
 *  This software is proprietary and confidential.
 *  Unauthorized copying of this file, via any medium, is strictly prohibited.
 */

import type { AMInstance } from "./amInstance";

export class AMRealm {
	private _AM: AMInstance;
	private _realmName: string;

	constructor(realmName: string, AM: AMInstance) {
		this._AM = AM;
		this._realmName = realmName;
	}

	public get realmName() {
		return this._realmName;
	}

	public get AM() {
		return this._AM;
	}
}
