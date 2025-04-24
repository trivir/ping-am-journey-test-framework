/*
 * Copyright (c) 2015-2025 TriVir LLC - All Rights Reserved
 *
 *  This software is proprietary and confidential.
 *  Unauthorized copying of this file, via any medium, is strictly prohibited.
 */

import { describe, test } from "vitest";
import { Callbacks } from "../../../Types";
import { nameCallback, passwordCallback } from "../callbacks";
import { authId, description, header } from "../response";
import { validateCallbacks, validateResponse } from "../utils";

describe("Assertion unit tests", () => {
	describe("hasAuthId Unit Tests", () => {
		test("Should validate having a authId property defined", () => {
			const mockResponse = {
				authId: "authIdString",
				callbacks: [],
			};
			validateResponse(mockResponse, authId());
		});
		test("Should validate having a authId property that matches an expected value", () => {
			const mockResponse = {
				authId: "authIdString",
				callbacks: [],
			};
			validateResponse(mockResponse, authId("authIdString"));
		});
		test("Should validate that the authId, header and the description are defined", () => {
			const mockResponse = {
				authId: "authIdString",
				description: "descriptionString",
				header: "headerString",
				callbacks: [],
			};
			validateResponse(mockResponse, [authId(), header(), description()]);
		});
	});
	describe("ValidateCallbacks unit tests", () => {
		test("Should validate the nameCallback and passwordCallbacks exist in the response", async () => {
			const mockResponse = {
				authId: "authIdString",
				callbacks: [
					{
						type: Callbacks.NameCallback,
						output: [
							{
								name: "prompt",
								value: "User Name",
							},
						],
						input: [
							{
								name: "IDToken1",
								value: "",
							},
						],
						_id: 0,
					},
					{
						type: Callbacks.PasswordCallback,
						output: [
							{
								name: "prompt",
								value: "Password",
							},
						],
						input: [
							{
								name: "IDToken2",
								value: "",
							},
						],
						_id: 1,
					},
				],
				header: "Sign In",
				description:
					'<a href="#/service/FRForgotUsername">Forgot username?</a><span style="opacity:0.5;padding:0 1em;">&bull;</span><a href="#/service/FRResetPassword">Forgot password?</a>',
			};
			validateCallbacks(mockResponse.callbacks, [
				nameCallback("User Name"),
				passwordCallback("Password"),
			]);
		});
	});
});
