import {
  hasProperties,
  hasProperty,
  hasItem,
  startsWith,
  hasItems,
  object,
  allOf,
} from "hamjest";
import { CallbackType } from "../../Types";

/**
 * Validates whether a callback object matches the structure of a NameCallback.
 *
 * This function checks if the given callback object has the correct type (`NameCallback`) and,
 * optionally, matches the provided `prompt` string. If a `prompt` is specified, the function
 * validates that the callback contains the specified prompt and an input field with a name
 * starting with "IDToken" and an empty value.
 *
 * @param prompt - An optional string to match against the `prompt` field in the callback.
 * @returns - A function that checks if a callback object matches the expected structure.
 *                       If `prompt` is undefined, it only checks for the correct type.
 */

function nameCallback(prompt?: string) {
  const isCorrectType = hasProperties({ type: CallbackType.NameCallback });

  if (prompt === undefined) return isCorrectType;

  const matcher = hasProperties({
    type: CallbackType.NameCallback,
    output: hasItem(hasProperties({ name: "prompt", value: prompt })),
    input: hasItem(hasProperties({ name: startsWith("IDToken"), value: "" })),
  });

  return matcher;
}

function passwordCallback(prompt?: string) {
  const isCorrectType = hasProperties({ type: CallbackType.PasswordCallback });

  if (prompt === undefined) return isCorrectType;

  const matcher = hasProperties({
    type: CallbackType.PasswordCallback,
    output: hasItem(hasProperties({ name: "prompt", value: prompt })),
    input: hasItem(hasProperties({ name: startsWith("IDToken"), value: "" })),
  });

  return matcher;
}

function textOutputCallback({
  message,
  messageType,
}: { message?: string; messageType?: string } = {}) {
  const isCorrectType = hasProperties({
    type: CallbackType.TextOutputCallback,
  });

  if (message === undefined && messageType === undefined) return isCorrectType;

  if (message && messageType) {
    const matcher = hasProperties({
      type: CallbackType.TextOutputCallback,
      output: hasItems(
        hasProperties({ name: "message", value: message }),
        hasProperties({ name: "messageType", value: messageType })
      ),
    });
    return matcher;
  }

  if (message && !messageType) {
    const matcher = hasProperties({
      type: CallbackType.TextOutputCallback,
      output: hasItems(hasProperties({ name: "message", value: message })),
    });
    return matcher;
  }

  const matcher = hasProperties({
    type: CallbackType.TextOutputCallback,
    output: hasItems(
      hasProperties({ name: "messageType", value: messageType })
    ),
  });
  return matcher;
}

function ignoreCallback() {
  return object();
}

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
}) {
  const isCorrectType = hasProperties({
    type: CallbackType.ConfirmationCallback,
  });

  const hasCorrectOptions = hasProperty(
    "output",
    hasItem(hasProperties({ name: "options", value: options }))
  );

  const hasCorrectOptionType = hasProperty(
    "output",
    hasItem(hasProperties({ name: "optionType", value: optionType }))
  );

  const hasCorrectMessageType = hasProperty(
    "output",
    hasItem(hasProperties({ name: "messageType", value: messageType }))
  );

  const hasCorrectPrompt = hasProperty(
    "output",
    hasItem(hasProperties({ name: "prompt", value: prompt }))
  );

  const hasInputToken = hasProperty(
    "input",
    hasItem(hasProperties({ name: startsWith("IDToken") }))
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

function validatedCreatePasswordCallback(prompt?: string) {
  const isCorrectType = hasProperties({
    type: CallbackType.ValidatedCreatePasswordCallback,
  });

  if (prompt === undefined) return isCorrectType;

  const matcher = hasProperties({
    type: CallbackType.ValidatedCreatePasswordCallback,
    output: hasItem(hasProperties({ name: "prompt", value: prompt })),
    input: hasItem(hasProperties({ name: startsWith("IDToken"), value: "" })),
  });

  return matcher;
}

function validatedCreateUsernameCallback(prompt?: string) {
  const isCorrectType = hasProperties({
    type: CallbackType.ValidatedCreateUsernameCallback,
  });

  if (prompt === undefined) return isCorrectType;

  const matcher = hasProperties({
    type: CallbackType.NameCallback,
    output: hasItem(hasProperties({ name: "prompt", value: prompt })),
    input: hasItem(hasProperties({ name: startsWith("IDToken"), value: "" })),
  });

  return matcher;
}

function choiceCallback({
  prompt,
  choices,
  defaultChoice,
}: {
  prompt?: string;
  choices?: string[];
  defaultChoice?: number;
}) {
  const isCorrectType = hasProperties({
    type: CallbackType.ChoiceCallback,
  });

  const hasCorrectPrompt = hasProperty(
    "output",
    hasItem(hasProperties({ name: "prompt", value: prompt }))
  );

  const hasCorrectChoices = hasProperty(
    "output",
    hasItem(hasProperties({ name: "choices", value: choices }))
  );

  const hasCorrectDefaultChoice = hasProperty(
    "output",
    hasItem(hasProperties({ name: "defaultChoice", value: defaultChoice }))
  );

  const hasInputToken = hasProperty(
    "input",
    hasItem(hasProperties({ name: startsWith("IDToken") }))
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

function hiddenValueCallback({
  id,
  initialValue,
}: {
  id?: string;
  initialValue?: string;
}) {
  const isCorrectType = hasProperties({
    type: CallbackType.HiddenValueCallback,
  });

  const hasCorrectId = hasProperty(
    "output",
    hasItem(hasProperties({ name: "id", value: id }))
  );

  const hasCorrectinitialValue = hasProperty(
    "output",
    hasItem(hasProperties({ name: "value", value: initialValue }))
  );

  const hasInputToken = hasProperty(
    "input",
    hasItem(hasProperties({ name: startsWith("IDToken") }))
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

function stringAttributeInputCallback(prompt?: string) {
  const isCorrectType = hasProperties({
    type: CallbackType.StringAttributeInputCallback,
  });

  if (prompt === undefined) return isCorrectType;

  const matcher = hasProperties({
    type: CallbackType.NameCallback,
    output: hasItem(hasProperties({ name: "prompt", value: prompt })),
    input: hasItem(hasProperties({ name: startsWith("IDToken"), value: "" })),
  });

  return matcher;
}

function booleanAttributeInputCallback(prompt?: string) {
  const isCorrectType = hasProperties({
    type: CallbackType.BooleanAttributeInputCallback,
  });

  if (prompt === undefined) return isCorrectType;

  const matcher = hasProperties({
    type: CallbackType.NameCallback,
    output: hasItem(hasProperties({ name: "prompt", value: prompt })),
    input: hasItem(hasProperties({ name: startsWith("IDToken"), value: "" })),
  });

  return matcher;
}

function termsAndConditionsCallback({
  version,
  terms,
  createDate,
}: {
  version?: string;
  terms?: string;
  createDate?: string;
}) {
  const isCorrectType = hasProperties({
    type: CallbackType.TermsAndConditionsCallback,
  });

  const hasCorrectVersion = hasProperty(
    "output",
    hasItem(hasProperties({ name: "version", value: version }))
  );

  const hasCorrectTerms = hasProperty(
    "output",
    hasItem(hasProperties({ name: "terms", value: terms }))
  );

  const hasCorrectCreateDate = hasProperty(
    "output",
    hasItem(hasProperties({ name: "createDate", value: createDate }))
  );

  const hasInputToken = hasProperty(
    "input",
    hasItem(hasProperties({ name: startsWith("IDToken") }))
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
