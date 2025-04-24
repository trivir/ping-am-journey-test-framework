/*
 * Copyright (c) 2015-2025 TriVir LLC - All Rights Reserved
 *
 *  This software is proprietary and confidential.
 *  Unauthorized copying of this file, via any medium, is strictly prohibited.
 */

import got, {
	type OptionsOfTextResponseBody,
	type Headers,
	type SearchParameters,
	type RequestError,
} from "got";
import type { Matcher, PropertiesMatcher } from "hamjest";
import { Cookie, CookieJar } from "tough-cookie";
import type { AMRealm } from "../AM/amRealm";
import type { AuthenticateResponse, Callback, Callbacks } from "../Types";
import { checkEmail } from "../Utils/email";
import { Logger } from "../Utils/logger";
import {
	validateCallbacks,
	validateError,
	validateResponse,
} from "./Assertions/utils";
import { stepMessageBuilder } from "./journeyUtils";

export class Journey {
	private _name: string;
	private _lastResponse: AuthenticateResponse | null = null;
	private _curCallbacks: Callback[] | null = null;
	private _realm: AMRealm;
	private _headers: Headers | null = null;
	private _otpAuthURI: string | null = null;
	private _otp: string | null = null;
	private _authError: RequestError<unknown> | null = null;
	private _queryParams: SearchParameters | null = null;
	private _cookieParams: { key: string; value: string } | null = null;

	/**
	 * Creates a new instance of the Journey class.
	 * @param name - The name of the journey.
	 * @param realm - The authentication realm.
	 * @param headers - Optional HTTP headers for the journey.
	 * @param queryParams - Optional query parameters for the journey.
	 * @param cookieParams - Optional cookie parameters for the journey.
	 */
	public constructor(
		name: string,
		realm: AMRealm,
		headers?: Headers,
		queryParams?: SearchParameters,
		cookieParams?: { key: string; value: string },
	) {
		this._name = name;
		this._realm = realm;

		if (headers) {
			this._headers = headers;
		}
		if (queryParams) {
			this._queryParams = queryParams;
		}
		if (cookieParams) {
			this._cookieParams = cookieParams;
		}
	}

	/**
	 * Gets the last authentication response.
	 */
	public get lastResponse() {
		return this._lastResponse;
	}

	/**
	 * Gets the the error response.
	 */
	public get authError() {
		return this._authError;
	}

	/**
	 * Gets the last current callbacks.
	 */

	public get curCallbacks() {
		return this._curCallbacks;
	}

	/**
	 * Gets the OTP value.
	 */
	public get otp(): string | null {
		return this._otp;
	}

	/**
	 * Gets the OTP Auth URI.
	 */
	public get otpAuthURI(): string | null {
		return this._otpAuthURI;
	}

	/**
	 * Sets the OTP value.
	 * @param otp - The OTP value to set.
	 */
	public set otp(otp: string) {
		this._otp = otp;
	}

	/**
	 * Sets the OTP Auth URI.
	 * @param otpAuthURI - The OTP Auth URI to set.
	 */
	public set otpAuthURI(otpAuthURI: string) {
		this._otpAuthURI = otpAuthURI;
	}

	/**
	 * Proceeds to the next step in the authentication journey.
	 * @returns The authentication response.
	 */
	public async nextStep() {
		const result = await this._postAuthenticate({
			journeyName: this._name,
			body: {
				...this._lastResponse,
				callbacks: this._curCallbacks,
			},
			headers: this._headers ?? {},
			queryParams: this._queryParams ?? {},
			cookieParams: this._cookieParams ?? undefined,
		});

		this._lastResponse = result;
		this._curCallbacks = result?.callbacks ?? null;
		return result;
	}

	/**
	 * Validates the callbacks in the last response.
	 * @param matchers - The matchers to validate against.
	 * @param stepName - The name of the step.
	 * @param stage - Optional stage name.
	 */
	public validateCallbacks(
		matchers: Matcher[],
		stepName: string,
		stage?: string,
	) {
		if (!this._lastResponse) {
			throw new Error(
				stepMessageBuilder(
					stepName,
					stage,
					"validate callbacks",
					`Unexpected error response: ${this._authError?.message}`,
				),
			);
		}

		return validateCallbacks(this._lastResponse.callbacks, matchers, stepName);
	}

	/**
	 * Validates the response properties in the last response.
	 * @param matchers - The matchers to validate against.
	 * @param stepName - The name of the step.
	 * @param stage - Optional stage name.
	 */
	public validateResponse(
		matchers: PropertiesMatcher | PropertiesMatcher[],
		stepName: string,
		stage?: string,
	) {
		if (!this._lastResponse) {
			throw new Error(
				stepMessageBuilder(
					stepName,
					stage,
					"validate response",
					`Unexpected error response: ${this._authError?.message}`,
				),
			);
		}

		return validateResponse(this._lastResponse, matchers, stepName);
	}

	/**
	 * Validates the error in the last response.
	 * @param matchers - The matchers to validate against.
	 * @param stepName - The name of the step.
	 * @param stage - Optional stage name.
	 */
	public validateError(
		matchers: PropertiesMatcher | PropertiesMatcher[],
		stepName: string,
		stage?: string,
	) {
		if (!this._authError) {
			throw new Error(
				stepMessageBuilder(
					stepName,
					stage,
					"validate error",
					"There is no error response to validate",
				),
			);
		}

		return validateError(this._authError, matchers, stepName);
	}

	/**
	 * Sets the value for a specific callback type.
	 * @param callbackType - The type of the callback.
	 * @param value - The value to set.
	 * @param stepName - The name of the step.
	 * @param stage - Optional stage name.
	 */
	public setValue(
		callbackType: Callbacks,
		value: string,
		stepName: string,
		stage?: string,
	) {
		const logger = Logger.getInstance();
		if (!this._curCallbacks) {
			throw new Error(
				stepMessageBuilder(
					stepName,
					stage,
					`set ${callbackType} to ${value}`,
					"Callbacks are undefined",
				),
			);
		}

		const callbackIndex = this._curCallbacks.findIndex((item) => {
			return item.type === callbackType;
		});

		if (!this._curCallbacks?.[callbackIndex]?.input) {
			throw new Error(
				stepMessageBuilder(
					stepName,
					stage,
					`set ${callbackType} to ${value}`,
					"There was a problem setting the callback value",
				),
			);
		}

		logger.log(`Setting ${callbackType} value: ${value} for ${stepName}`);

		this._curCallbacks[callbackIndex].input[0].value = value;
	}

	/**
	 * Finds the OTP Auth URI in the last response.
	 * @returns The OTP Auth URI, if found.
	 */
	public saveOtpAuthURI() {
		const logger = Logger.getInstance();
		let otpAuthURI: null | string = null;
		this._lastResponse?.callbacks.map((item) => {
			item.output?.some((outputItem) => {
				if (
					typeof outputItem.value === "string" &&
					outputItem.value.includes("otpauth://")
				) {
					otpAuthURI = outputItem.value;
				}
			});
		});

		logger.log(
			"Last Callback Response When Looking For OtpAuthURI:",
			this._lastResponse,
		);

		return otpAuthURI;
	}

	/**
	 * Checks the email for an OTP value.
	 * @param options - The options for checking the email.
	 */
	public async checkEmail({
		sender,
		subject,
		emailParser,
		timeDelay,
	}: {
		sender?: string;
		subject?: string;
		emailParser?: (str: string) => string;
		timeDelay?: number;
	}) {
		const otpValue = await checkEmail({
			sender,
			subject,
			emailParser,
			timeDelay,
		});

		this._otp = otpValue.trim();
		return otpValue.trim();
	}

	/**
	 * Sends a POST request to authenticate the journey.
	 * @param options - The options for the POST request.
	 * @returns The authentication response, if successful.
	 */
	private async _postAuthenticate({
		journeyName,
		body,
		headers,
		queryParams,
		cookieParams,
	}: {
		journeyName: string;
		body: unknown;
		headers: Headers;
		queryParams: SearchParameters;
		cookieParams?: { key: string; value: string };
	}): Promise<AuthenticateResponse | null> {
		const logger = Logger.getInstance();
		const baseUrl = new URL(this._realm.AM.baseURL);

		let options: OptionsOfTextResponseBody = {
			searchParams: {
				...queryParams,
				realm: this._realm.realmName,
				authIndexType: "service",
				authIndexValue: journeyName,
			},
		};

		if (cookieParams) {
			const cookieJar = new CookieJar();
			const cookie = new Cookie({
				key: cookieParams.key,
				value: cookieParams.value,
				domain: baseUrl.hostname,
				path: "/",
				creation: new Date(),
			});

			await cookieJar.setCookie(cookie, baseUrl.href);

			options = {
				...options,
				cookieJar,
			};
		}

		options = {
			...options,
			ignoreInvalidCookies: true,
			method: "POST",
			json: body ? { ...body } : {},
			headers: {
				...headers,
				"Is-Journey-Test": "true",
				"X-Requested-With": "ping-aic-library-ts",
				"accept-api-version": "protocol=1.0,resource=2.1",
			},
		};

		logger.log(
			"Post /authenticate request:",
			`URL: ${baseUrl.href}am/json/authenticate`,
			"options:",
			options,
		);

		try {
			const data = await got(
				`${baseUrl.href}am/json/authenticate`,
				options,
			).json();

			this._authError = null;

			logger.log("Post /authenticate response:", data);
			return data as AuthenticateResponse;
		} catch (error: unknown) {
			logger.log(
				"Error in postAuthenticate:",
				(error as RequestError<unknown>).message,
				"error",
				JSON.stringify(error, Object.getOwnPropertyNames(error)),
			);
			this._authError = error as RequestError<unknown>;
		}

		return null;
	}
}
