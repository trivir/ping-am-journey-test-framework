/*
 * Copyright (c) 2015-2025 TriVir LLC - All Rights Reserved
 *
 *  This software is proprietary and confidential.
 *  Unauthorized copying of this file, via any medium, is strictly prohibited.
 */

import type { Headers, SearchParameters } from "got";
import * as OTPAuth from "otpauth";
import { AMInstance } from "../AM/amInstance";
import { AMRealm } from "../AM/amRealm";
import { Actions, type JourneyStep, type StepOperations } from "../Types";
import { loadConfig } from "../config";
import {
	checkEmail,
	createOTP,
	saveOtpAuthURI,
	setCallbackValue,
	setNameCallbackValue,
	setOTP,
	setPasswordCallbackValue,
} from "./actions";
import { Journey } from "./journey";

/**
 * Executes a journey by processing a series of steps within a specified realm and AM instance.
 *
 * @param params - The parameters for running the journey.
 * @param params.amUrl - The base URL of the AM instance. If not provided, the default `BASE_URL` from the config is used.
 * @param params.realmName - The name of the realm where the journey is executed. Will use the value for `REALM` from the config if not provided.
 * @param params.journeyName - The name of the journey to be executed.
 * @param params.headers - Optional headers to include in the journey requests.
 * @param params.queryParams - Optional query parameters to include in the journey requests.
 * @param params.steps - The steps to be processed as part of the journey.
 * @param params.cookieParams - Optional cookie parameters to include in the journey requests.
 * @param params.cookieParams.key - The key of the cookie.
 * @param params.cookieParams.value - The value of the cookie.
 *
 * @returns A promise that resolves when the journey steps have been processed.
 */
export async function runJourney({
	amUrl,
	realmName,
	journeyName,
	headers,
	queryParams,
	steps,
	cookieParams,
}: {
	amUrl?: string;
	realmName?: string;
	journeyName: string;
	headers?: Headers;
	queryParams?: SearchParameters;
	steps: JourneyStep[];
	cookieParams?: { key: string; value: string };
}): Promise<void> {
	const { BASE_URL, REALM } = loadConfig();

	if (!amUrl && !BASE_URL) {
		throw new Error(
			"No AM URL provided and no default URL found in the configuration",
		);
	}

	if (!realmName && !REALM) {
		throw new Error(
			"No realm name provided and no default realm found in the configuration",
		);
	}

	const am = new AMInstance(amUrl ?? BASE_URL);
	const realm = new AMRealm(realmName ?? REALM, am);
	const journey = new Journey(
		journeyName,
		realm,
		headers,
		queryParams,
		cookieParams,
	);

	const preProcessedJourneySteps = preProcessJourneySteps(steps);

	await processJourneySteps(journey, preProcessedJourneySteps);
}

/**
 * Preprocesses an array of journey steps by resolving any step functions
 * into their corresponding `JourneyStep` objects.
 *
 * This function takes an array of `JourneyStep` objects or functions that
 * return `JourneyStep` objects, and flattens the array by invoking any
 * functions to retrieve their `JourneyStep` values.
 *
 * @param steps - An array of `JourneyStep` objects or functions that return
 * `JourneyStep` objects.
 * @returns An array of resolved `JourneyStep` objects.
 */
function preProcessJourneySteps(
	steps: (JourneyStep | (() => JourneyStep))[],
): JourneyStep[] {
	return steps.flatMap((step) => (typeof step === "function" ? step() : step));
}

/**
 * Processes a sequence of journey steps by executing pre-step and post-step operations
 * and advancing the journey to the next step.
 *
 * @param journey - The journey instance to process the steps for.
 * @param steps - An array of `JourneyStep` objects representing the steps to process.
 *
 * @returns A promise that resolves when all steps have been processed.
 */
export async function processJourneySteps(
	journey: Journey,
	steps: JourneyStep[],
) {
	for await (const step of steps) {
		if (step.preStep) {
			await processStepOperations(journey, step.preStep, step.name, "preStep");
		}

		await journey.nextStep();

		if (step.postStep) {
			await processStepOperations(
				journey,
				step.postStep,
				step.name,
				"postStep",
			);
		}
	}
}

/**
 * Processes the operations for a specific step in a journey, including validations and actions.
 *
 * @param journey - The journey instance that provides methods for validation and other operations.
 * @param stepOperations - The operations to be performed for the step, including validation and actions.
 * @param stepName - The name of the step being processed.
 * @param stage - The current stage of the journey, used for logging and context.
 *
 * @throws Will throw an error if any validation or action fails during processing.
 */
export async function processStepOperations(
	journey: Journey,
	stepOperations: StepOperations,
	stepName: string,
	stage: string,
) {
	if (stepOperations.validation) {
		if (stepOperations.validation.error) {
			journey.validateError(stepOperations.validation.error, stepName, stage);
		}

		if (stepOperations.validation.response) {
			journey.validateResponse(
				stepOperations.validation.response,
				stepName,
				`${stage} validation response`,
			);
		}

		if (stepOperations.validation.callbacks) {
			journey.validateCallbacks(
				stepOperations.validation.callbacks,
				stepName,
				`${stage} validation callbacks`,
			);
		}
	}

	if (stepOperations.actions) {
		for await (const input of stepOperations.actions) {
			await actions[input.action](journey, input, stepName, `${stage} actions`);
		}
	}
}

const actions = {
	[Actions.createOTP]: createOTP,
	[Actions.setNameCallbackValue]: setNameCallbackValue,
	[Actions.setPasswordCallbackValue]: setPasswordCallbackValue,
	[Actions.checkEmail]: checkEmail,
	[Actions.setOTP]: setOTP,
	[Actions.setCallbackValue]: setCallbackValue,
	[Actions.saveOtpAuthURI]: saveOtpAuthURI,
};

/**
 * Generates a One-Time Password (OTP) based on the provided OTP Auth URI.
 *
 * @param otpAuthURI - The OTP Auth URI string used to generate the OTP.
 *                      This URI should follow the OTPAuth URI format.
 * @returns The generated OTP as a string.
 */
export function generateOTP(otpAuthURI: string) {
	const totp = OTPAuth.URI.parse(otpAuthURI);

	return totp.generate();
}

/**
 * Builds a formatted message string for a specific step in a journey process.
 *
 * @param stepName - The name of the step in the journey.
 * @param stage - The current stage of the step.
 * @param action - The action being performed in the step.
 * @param message - Additional information or message related to the step.
 * @returns A formatted string containing the step details.
 */
export function stepMessageBuilder(
	stepName?: string,
	stage?: string,
	action?: string,
	message?: string,
) {
	return `
  Step: ${stepName ?? "N/A"}.
  Stage: ${stage ?? "N/A"}
  Action: ${action ?? "N/A"}
  Message: ${message ?? "N/A"}`;
}
