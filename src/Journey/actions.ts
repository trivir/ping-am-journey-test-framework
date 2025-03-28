import { type Action, Callbacks } from "../Types";
import { Logger } from "../Utils/logger";
import type { Journey } from "./journey";
import { generateOTP, stepMessageBuilder } from "./journeyUtils";

export function saveOtpAuthURI(
	journey: Journey,
	_action: Action,
	stepName: string,
	stage: string,
) {
	const logger = Logger.getInstance();
	const otpAuthURI = journey.saveOtpAuthURI();

	if (!otpAuthURI) {
		throw new Error(
			stepMessageBuilder(
				stepName,
				stage,
				"save otp auth URI",
				"Unable to find and save the otpAuthURI",
			),
		);
	}

	logger.log(`Found OTP Auth URI: ${otpAuthURI}`);

	journey.otpAuthURI = otpAuthURI;
}

export function createOTP(
	journey: Journey,
	action: Action,
	stepName: string,
	stage: string,
) {
	const logger = Logger.getInstance();
	const otpURI = action.value ?? journey.otpAuthURI;

	if (!otpURI) {
		throw new Error(
			stepMessageBuilder(
				stepName,
				stage,
				"createOTP",
				"An OTP URI is required to generate a OTP, either provide it as a value with the action, or save it in a preceding step.",
			),
		);
	}

	logger.log(`Generating OTP using URI: ${otpURI}`);

	const otp = generateOTP(otpURI);

	logger.log(`Generated OTP: ${otp}`);

	journey.otp = otp;
}

export function setNameCallbackValue(
	journey: Journey,
	action: Action,
	stepName: string,
	stage: string,
) {
	if (action.value === undefined) {
		throw new Error(
			stepMessageBuilder(
				stepName,
				stage,
				"Set NameCallback Value",
				"A value is required to use the action setCallbackValue",
			),
		);
	}
	journey.setValue(Callbacks.NameCallback, action.value, stepName, stage);
}

export function setPasswordCallbackValue(
	journey: Journey,
	action: Action,
	stepName: string,
	stage: string,
) {
	if (action.value === undefined) {
		throw new Error(
			stepMessageBuilder(
				stepName,
				stage,
				"Set PasswordCallback Value",
				"A value is required to use the action setCallbackValue",
			),
		);
	}
	journey.setValue(Callbacks.PasswordCallback, action.value, stepName, stage);
}

export async function checkEmail(
	journey: Journey,
	action: Action,
	stepName: string,
	stage: string,
) {
	if (!action.checkEmailParams) {
		throw new Error(
			stepMessageBuilder(
				stepName,
				stage,
				"check email",
				"checkEmailParams are required to use the action checkEmail",
			),
		);
	}
	await journey.checkEmail(action.checkEmailParams);
}

export function setOTP(
	journey: Journey,
	action: Action,
	stepName: string,
	stage: string,
) {
	if (!action.callbackType) {
		throw new Error(
			stepMessageBuilder(
				stepName,
				stage,
				"set OTP",
				"A callback type is required to use the action setOTP",
			),
		);
	}
	if (!journey.otp && action.value === undefined) {
		throw new Error(
			stepMessageBuilder(
				stepName,
				stage,
				"set OTP",
				"An otp code is required to use the setOTP action. Either provide one as a value or call another action to generate one.",
			),
		);
	}
	journey.setValue(
		action.callbackType,
		action.value ?? (journey.otp as string),
		stepName,
		stage,
	);
}

export function setCallbackValue(
	journey: Journey,
	action: Action,
	stepName: string,
	stage: string,
) {
	if (!action.callbackType) {
		throw new Error(
			stepMessageBuilder(
				stepName,
				stage,
				"set callback value",
				"A callback type is required to use the action setCallbackValue",
			),
		);
	}
	if (action.value === undefined) {
		throw new Error(
			stepMessageBuilder(
				stepName,
				stage,
				"set callback value",
				"A value is required to use the action setCallbackValue",
			),
		);
	}
	journey.setValue(action.callbackType, action.value, stepName, stage);
}
