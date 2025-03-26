import type { RequestError } from "got";
import { type Matcher, type PropertiesMatcher, assertThat, is } from "hamjest";
import type { AuthenticateResponse, Callback } from "../../Types";

/**
 * A utility to validate objects
 * @param response the response object to be validated
 * @param matchers a single matcher or an array of matchers that are used to determine if the response object is valid
 * @param stepName an optional name value that is used to provide more useful messages when tests fail
 * @returns
 */
export function validateResponse(
	response: AuthenticateResponse,
	matchers: PropertiesMatcher | PropertiesMatcher[],
	stepName?: string,
) {
	if (Array.isArray(matchers)) {
		return matchers.map((matcher) => {
			return assertThat(`Step: ${stepName}`, response, matcher);
		});
	}
	return assertThat(
		stepName ? `Step: ${stepName}` : "",
		response,
		is(matchers),
	);
}

/**
 * A utility to validate errorobjects
 * @param response the error object to be validated
 * @param matchers a single matcher or an array of matchers that are used to determine if the error object is valid
 * @param stepName an optional name value that is used to provide more useful messages when tests fail
 * @returns
 */
export function validateError(
	response: RequestError,
	matchers: PropertiesMatcher | PropertiesMatcher[],
	stepName?: string,
) {
	if (Array.isArray(matchers)) {
		return matchers.map((matcher) => {
			return assertThat(`Step: ${stepName}`, response, matcher);
		});
	}
	return assertThat(
		stepName ? `Step: ${stepName}` : "",
		response,
		is(matchers),
	);
}

/**
 * A utility to validate that the response callbacks match the expected properties and values
 * @param callbacks an array of callbacks to be validated
 * @param matchers an array of matchers that are used to determine if the provided callbacks are valid
 * @param stepName an optional name value that is used to provide more useful messages when tests fail
 * @returns
 */
export function validateCallbacks(
	callbacks: Callback[],
	matchers: Matcher[],
	stepName?: string,
) {
	return matchers.map((matcher, i) => {
		return assertThat(
			stepName ? `Callback for step: ${stepName}` : "",
			callbacks?.[i],
			is(matcher),
		);
	});
}
