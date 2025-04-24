/*
 * Copyright (c) 2015-2025 TriVir LLC - All Rights Reserved
 *
 *  This software is proprietary and confidential.
 *  Unauthorized copying of this file, via any medium, is strictly prohibited.
 */

import { defined, hasProperties } from "hamjest";

/**
 * Will match if the authId property is defined on the object. If provided, it will only match if the exact authId value is defined.
 * @param authId the expected authId value
 * @returns
 */
export function authId(authId?: string) {
	return hasProperties({ authId: authId !== undefined ? authId : defined() });
}

/**
 * Will match if the header property is defined on the object. If provided, it will only match if the exact header value is defined.
 * @param header the expected header value
 * @returns
 */
export function header(header?: string) {
	return hasProperties({ header: header !== undefined ? header : defined() });
}

/**
 * Will match if the description property is defined on the object. If provided, it will only match if the exact description value is defined.
 * @param description the expected description value
 * @returns
 */
export function description(description?: string) {
	return hasProperties({
		description: description !== undefined ? description : defined(),
	});
}

/**
 * Will match if the successUrl property is defined on the object. If provided, it will only match if the exact successUrl value is defined.
 * @param url the expected successUrl value
 * @returns
 */
export function successUrl(url?: string) {
	return hasProperties({ successUrl: url !== undefined ? url : defined() });
}
