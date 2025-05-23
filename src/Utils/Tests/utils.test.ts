/*
 * Copyright (c) 2015-2025 TriVir LLC - All Rights Reserved
 *
 *  This software is proprietary and confidential.
 *  Unauthorized copying of this file, via any medium, is strictly prohibited.
 */

import { assertThat } from "hamjest";
import { describe, test } from "vitest";
import { stringBuilder } from "../utils";

describe("util tests", () => {
	describe("stringBuilder tests", () => {
		test("should replace the template with the variable value", () => {
			const stringTemplate = "This is a {variable} string";
			const desiredString = "This is a test string";

			const resultString = stringBuilder(stringTemplate, { variable: "test" });
			assertThat(resultString, desiredString);
		});
		test("should leave the template if there is not a matching variable", () => {
			const stringTemplate = "This is a {variable} {anotherOne} string";
			const desiredString = "This is a test {anotherOne} string";

			const resultString = stringBuilder(stringTemplate, { variable: "test" });
			assertThat(resultString, desiredString);
		});
	});
});
