import { defined, hasProperties } from "hamjest";

/**
 * Will match if the last authenticate request resulted in an http error.
 * @param message the expected error message value
 * @returns
 */
export function errorState({ message }: { message?: string } = {}) {
  return hasProperties({
    message: message !== undefined ? message : defined(),
  });
}
