/*
 * Copyright (c) 2015-2025 TriVir LLC - All Rights Reserved
 *
 *  This software is proprietary and confidential.
 *  Unauthorized copying of this file, via any medium, is strictly prohibited.
 */

import {
	type Matcher,
	allOf,
	hasItem,
	hasItems,
	hasProperties,
	hasProperty,
	object,
	startsWith,
} from "hamjest";
import { Callbacks } from "../../Types";

/**
 * Validates whether a callback object matches the structure of a NameCallback.
 *
 * @param prompt - An optional string to match against the `prompt` field in the callback.
 * @returns - A matcher function that checks if a callback object matches the expected structure.
 */
function nameCallback(prompt?: string): Matcher {
	const isCorrectType = hasProperties({ type: Callbacks.NameCallback });

	if (prompt === undefined) return isCorrectType;

	const matcher = hasProperties({
		type: Callbacks.NameCallback,
		output: hasItem(hasProperties({ name: "prompt", value: prompt })),
		input: hasItem(hasProperties({ name: startsWith("IDToken"), value: "" })),
	});

	return matcher;
}

/**
 * Validates whether a callback object matches the structure of a PasswordCallback.
 *
 * @param prompt - An optional string to match against the `prompt` field in the callback.
 * @returns - A matcher function that checks if a callback object matches the expected structure.
 */
function passwordCallback(prompt?: string): Matcher {
	const isCorrectType = hasProperties({ type: Callbacks.PasswordCallback });

	if (prompt === undefined) return isCorrectType;

	const matcher = hasProperties({
		type: Callbacks.PasswordCallback,
		output: hasItem(hasProperties({ name: "prompt", value: prompt })),
		input: hasItem(hasProperties({ name: startsWith("IDToken"), value: "" })),
	});

	return matcher;
}

/**
 * Validates whether a callback object matches the structure of a TextOutputCallback.
 *
 * @param params - An object containing optional parameters.
 * @param params.message - An optional string to match against the `message` field in the callback.
 * @param params.messageType - An optional string to match against the `messageType` field in the callback.
 * @returns - A matcher function that checks if a callback object matches the expected structure.
 */
function textOutputCallback({
	message,
	messageType,
}: { message?: string; messageType?: string } = {}): Matcher {
	const isCorrectType = hasProperties({
		type: Callbacks.TextOutputCallback,
	});

	if (message === undefined && messageType === undefined) return isCorrectType;

	if (message && messageType) {
		const matcher = hasProperties({
			type: Callbacks.TextOutputCallback,
			output: hasItems(
				hasProperties({ name: "message", value: message }),
				hasProperties({ name: "messageType", value: messageType }),
			),
		});
		return matcher;
	}

	if (message && !messageType) {
		const matcher = hasProperties({
			type: Callbacks.TextOutputCallback,
			output: hasItems(hasProperties({ name: "message", value: message })),
		});
		return matcher;
	}

	const matcher = hasProperties({
		type: Callbacks.TextOutputCallback,
		output: hasItems(
			hasProperties({ name: "messageType", value: messageType }),
		),
	});
	return matcher;
}

/**
 * Validates whether a callback object matches the structure of an IgnoreCallback.
 *
 * @returns - A matcher function that always matches any object.
 */
function ignoreCallback(): Matcher {
	return object();
}

/**
 * Validates whether a callback object matches the structure of a ConfirmationCallback.
 *
 * @param params - An object containing optional parameters.
 * @param params.prompt - An optional string to match against the `prompt` field in the callback.
 * @param params.messageType - An optional number to match against the `messageType` field in the callback.
 * @param params.options - An optional array of strings to match against the `options` field in the callback.
 * @param params.optionType - An optional number to match against the `optionType` field in the callback.
 * @returns - A matcher function that checks if a callback object matches the expected structure.
 */
function confirmationCallback({
	prompt,
	messageType,
	options,
	optionType,
}: {
	prompt?: string;
	messageType?: number;
	options?: string[];
	optionType?: number;
}): Matcher {
	const isCorrectType = hasProperties({
		type: Callbacks.ConfirmationCallback,
	});

	const hasCorrectOptions = hasProperty(
		"output",
		hasItem(hasProperties({ name: "options", value: options })),
	);

	const hasCorrectOptionType = hasProperty(
		"output",
		hasItem(hasProperties({ name: "optionType", value: optionType })),
	);

	const hasCorrectMessageType = hasProperty(
		"output",
		hasItem(hasProperties({ name: "messageType", value: messageType })),
	);

	const hasCorrectPrompt = hasProperty(
		"output",
		hasItem(hasProperties({ name: "prompt", value: prompt })),
	);

	const hasInputToken = hasProperty(
		"input",
		hasItem(hasProperties({ name: startsWith("IDToken") })),
	);

	let matcherConditions = [isCorrectType];

	if (prompt !== undefined) {
		matcherConditions = [...matcherConditions, hasCorrectPrompt];
	}
	if (messageType !== undefined) {
		matcherConditions = [...matcherConditions, hasCorrectMessageType];
	}
	if (options !== undefined) {
		matcherConditions = [...matcherConditions, hasCorrectOptions];
	}
	if (optionType !== undefined) {
		matcherConditions = [...matcherConditions, hasCorrectOptionType];
	}

	matcherConditions = [...matcherConditions, hasInputToken];
	return allOf(...matcherConditions);
}

/**
 * Validates whether a callback object matches the structure of a ValidatedCreatePasswordCallback.
 *
 * @param prompt - An optional string to match against the `prompt` field in the callback.
 * @returns - A matcher function that checks if a callback object matches the expected structure.
 */
function validatedCreatePasswordCallback(prompt?: string): Matcher {
	const isCorrectType = hasProperties({
		type: Callbacks.ValidatedCreatePasswordCallback,
	});

	if (prompt === undefined) return isCorrectType;

	const matcher = hasProperties({
		type: Callbacks.ValidatedCreatePasswordCallback,
		output: hasItem(hasProperties({ name: "prompt", value: prompt })),
		input: hasItem(hasProperties({ name: startsWith("IDToken"), value: "" })),
	});

	return matcher;
}

/**
 * Validates whether a callback object matches the structure of a ValidatedCreateUsernameCallback.
 *
 * @param prompt - An optional string to match against the `prompt` field in the callback.
 * @returns - A matcher function that checks if a callback object matches the expected structure.
 */
function validatedCreateUsernameCallback(prompt?: string): Matcher {
	const isCorrectType = hasProperties({
		type: Callbacks.ValidatedCreateUsernameCallback,
	});

	if (prompt === undefined) return isCorrectType;

	const matcher = hasProperties({
		type: Callbacks.NameCallback,
		output: hasItem(hasProperties({ name: "prompt", value: prompt })),
		input: hasItem(hasProperties({ name: startsWith("IDToken"), value: "" })),
	});

	return matcher;
}

/**
 * Validates whether a callback object matches the structure of a ChoiceCallback.
 *
 * @param params - An object containing optional parameters.
 * @param params.prompt - An optional string to match against the `prompt` field in the callback.
 * @param params.choices - An optional array of strings to match against the `choices` field in the callback.
 * @param params.defaultChoice - An optional number to match against the `defaultChoice` field in the callback.
 * @returns - A matcher function that checks if a callback object matches the expected structure.
 */
function choiceCallback({
	prompt,
	choices,
	defaultChoice,
}: {
	prompt?: string;
	choices?: string[];
	defaultChoice?: number;
}): Matcher {
	const isCorrectType = hasProperties({
		type: Callbacks.ChoiceCallback,
	});

	const hasCorrectPrompt = hasProperty(
		"output",
		hasItem(hasProperties({ name: "prompt", value: prompt })),
	);

	const hasCorrectChoices = hasProperty(
		"output",
		hasItem(hasProperties({ name: "choices", value: choices })),
	);

	const hasCorrectDefaultChoice = hasProperty(
		"output",
		hasItem(hasProperties({ name: "defaultChoice", value: defaultChoice })),
	);

	const hasInputToken = hasProperty(
		"input",
		hasItem(hasProperties({ name: startsWith("IDToken") })),
	);

	let matcherConditions = [isCorrectType];

	if (prompt !== undefined) {
		matcherConditions = [...matcherConditions, hasCorrectPrompt];
	}

	if (choices !== undefined) {
		matcherConditions = [...matcherConditions, hasCorrectChoices];
	}

	if (defaultChoice !== undefined) {
		matcherConditions = [...matcherConditions, hasCorrectDefaultChoice];
	}

	matcherConditions = [...matcherConditions, hasInputToken];
	return allOf(...matcherConditions);
}

/**
 * Validates whether a callback object matches the structure of a HiddenValueCallback.
 *
 * @param params - An object containing optional parameters.
 * @param params.id - An optional string to match against the `id` field in the callback.
 * @param params.initialValue - An optional string to match against the `value` field in the callback.
 * @returns - A matcher function that checks if a callback object matches the expected structure.
 */
function hiddenValueCallback({
	id,
	initialValue,
}: {
	id?: string;
	initialValue?: string;
}): Matcher {
	const isCorrectType = hasProperties({
		type: Callbacks.HiddenValueCallback,
	});

	const hasCorrectId = hasProperty(
		"output",
		hasItem(hasProperties({ name: "id", value: id })),
	);

	const hasCorrectinitialValue = hasProperty(
		"output",
		hasItem(hasProperties({ name: "value", value: initialValue })),
	);

	const hasInputToken = hasProperty(
		"input",
		hasItem(hasProperties({ name: startsWith("IDToken") })),
	);

	let matcherConditions = [isCorrectType];

	if (id !== undefined) {
		matcherConditions = [...matcherConditions, hasCorrectId];
	}

	if (initialValue !== undefined) {
		matcherConditions = [...matcherConditions, hasCorrectinitialValue];
	}

	matcherConditions = [...matcherConditions, hasInputToken];
	return allOf(...matcherConditions);
}

/**
 * Validates whether a callback object matches the structure of a StringAttributeInputCallback.
 *
 * @param prompt - An optional string to match against the `prompt` field in the callback.
 * @returns - A matcher function that checks if a callback object matches the expected structure.
 */
function stringAttributeInputCallback(prompt?: string): Matcher {
	const isCorrectType = hasProperties({
		type: Callbacks.StringAttributeInputCallback,
	});

	if (prompt === undefined) return isCorrectType;

	const matcher = hasProperties({
		type: Callbacks.NameCallback,
		output: hasItem(hasProperties({ name: "prompt", value: prompt })),
		input: hasItem(hasProperties({ name: startsWith("IDToken"), value: "" })),
	});

	return matcher;
}

/**
 * Validates whether a callback object matches the structure of a BooleanAttributeInputCallback.
 *
 * @param prompt - An optional string to match against the `prompt` field in the callback.
 * @returns - A matcher function that checks if a callback object matches the expected structure.
 */
function booleanAttributeInputCallback(prompt?: string): Matcher {
	const isCorrectType = hasProperties({
		type: Callbacks.BooleanAttributeInputCallback,
	});

	if (prompt === undefined) return isCorrectType;

	const matcher = hasProperties({
		type: Callbacks.NameCallback,
		output: hasItem(hasProperties({ name: "prompt", value: prompt })),
		input: hasItem(hasProperties({ name: startsWith("IDToken"), value: "" })),
	});

	return matcher;
}

/**
 * Validates whether a callback object matches the structure of a TermsAndConditionsCallback.
 *
 * @param params - An object containing optional parameters.
 * @param params.version - An optional string to match against the `version` field in the callback.
 * @param params.terms - An optional string to match against the `terms` field in the callback.
 * @param params.createDate - An optional string to match against the `createDate` field in the callback.
 * @returns - A matcher function that checks if a callback object matches the expected structure.
 */
function termsAndConditionsCallback({
	version,
	terms,
	createDate,
}: {
	version?: string;
	terms?: string;
	createDate?: string;
}): Matcher {
	const isCorrectType = hasProperties({
		type: Callbacks.TermsAndConditionsCallback,
	});

	const hasCorrectVersion = hasProperty(
		"output",
		hasItem(hasProperties({ name: "version", value: version })),
	);

	const hasCorrectTerms = hasProperty(
		"output",
		hasItem(hasProperties({ name: "terms", value: terms })),
	);

	const hasCorrectCreateDate = hasProperty(
		"output",
		hasItem(hasProperties({ name: "createDate", value: createDate })),
	);

	const hasInputToken = hasProperty(
		"input",
		hasItem(hasProperties({ name: startsWith("IDToken") })),
	);

	let matcherConditions = [isCorrectType];

	if (version !== undefined) {
		matcherConditions = [...matcherConditions, hasCorrectVersion];
	}

	if (terms !== undefined) {
		matcherConditions = [...matcherConditions, hasCorrectTerms];
	}

	if (createDate !== undefined) {
		matcherConditions = [...matcherConditions, hasCorrectCreateDate];
	}

	matcherConditions = [...matcherConditions, hasInputToken];
	return allOf(...matcherConditions);
}

export {
	nameCallback,
	passwordCallback,
	textOutputCallback,
	ignoreCallback,
	confirmationCallback,
	validatedCreatePasswordCallback,
	validatedCreateUsernameCallback,
	choiceCallback,
	hiddenValueCallback,
	stringAttributeInputCallback,
	booleanAttributeInputCallback,
	termsAndConditionsCallback,
};
