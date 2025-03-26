import { assertThat, not } from "hamjest";
import { test, describe } from "vitest";
import {
  choiceCallback,
  confirmationCallback,
  hiddenValueCallback,
  nameCallback,
  passwordCallback,
  stringAttributeInputCallback,
  termsAndConditionsCallback,
  textOutputCallback,
  validatedCreatePasswordCallback,
  validatedCreateUsernameCallback,
} from "../callbacks";
import { Callbacks } from "../../../Types";

describe("Callback unit tests", () => {
  describe("nameCallback unit tests", () => {
    const nameCallbackMock = {
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
    };
    test("Should match when the callback type is NameCallback", () => {
      assertThat(nameCallbackMock, nameCallback());
    });
    test("Should match when the callback type is NameCallback and the provided prompt value is found", () => {
      assertThat(nameCallbackMock, nameCallback("User Name"));
    });
    test("Should not match when when the provided prompt value is not found", () => {
      assertThat(nameCallbackMock, not(nameCallback("User")));
    });
    test("Should not match when when the provided prompt value is an empty string", () => {
      assertThat(nameCallbackMock, not(nameCallback("")));
    });
    test("Should not match when the callback type is not NameCallback", () => {
      const invalidNameCallbackMock = {
        ...nameCallbackMock,
        type: Callbacks.PasswordCallback,
      };

      assertThat(invalidNameCallbackMock, not(nameCallback()));
    });
  });
  describe("passwordCallback unit tests", () => {
    const passwordCallbackMock = {
      type: Callbacks.PasswordCallback,
      output: [
        {
          name: "prompt",
          value: "Password",
        },
      ],
      input: [
        {
          name: "IDToken1",
          value: "",
        },
      ],
      _id: 0,
    };
    test("Should match when the callback type is PasswordCallback", () => {
      assertThat(passwordCallbackMock, passwordCallback());
    });
    test("Should match when the callback type is PasswordCallback and the provided prompt value is found", () => {
      assertThat(passwordCallbackMock, passwordCallback("Password"));
    });
    test("Should not match when the provided prompt value is not found", () => {
      assertThat(passwordCallbackMock, not(passwordCallback("User")));
    });
    test("Should not match when the provided prompt value is an empty string", () => {
      assertThat(passwordCallbackMock, not(passwordCallback("")));
    });
    test("Should not match when the callback type is not PasswordCallback", () => {
      const invalidPasswordCallbackMock = {
        ...passwordCallbackMock,
        type: Callbacks.NameCallback,
      };

      assertThat(invalidPasswordCallbackMock, not(passwordCallback()));
    });
  });
  describe("textOutputCallback unit tests", () => {
    const textOutputCallbackMock = {
      type: Callbacks.TextOutputCallback,
      output: [
        {
          name: "message",
          value: "Default message",
        },
        {
          name: "messageType",
          value: "0",
        },
      ],
      _id: 0,
    };
    test("Should match when the callback type is TexOutputCallback", () => {
      assertThat(textOutputCallbackMock, textOutputCallback());
    });
    test("Should match when the callback type is TexOutputCallback and the provided message value is found", () => {
      assertThat(
        textOutputCallbackMock,
        textOutputCallback({ message: "Default message" })
      );
    });
    test("Should match when the callback type is TexOutputCallback and the provided messageType value is found", () => {
      assertThat(
        textOutputCallbackMock,
        textOutputCallback({ messageType: "0" })
      );
    });
    test("Should match when the callback type is TexOutputCallback and the provided message and messageType values are found", () => {
      assertThat(
        textOutputCallbackMock,
        textOutputCallback({
          message: "Default message",
          messageType: "0",
        })
      );
    });

    test("Should not match when the provided message and messageType values are not found", () => {
      assertThat(
        textOutputCallbackMock,
        not(
          textOutputCallback({
            message: "Wrong",
            messageType: "3",
          })
        )
      );
    });

    test("Should not match when the provided message and messageType values are empty strings", () => {
      assertThat(
        textOutputCallbackMock,
        not(
          textOutputCallback({
            message: "",
            messageType: "",
          })
        )
      );
    });

    test("Should not match when the provided message value is not found", () => {
      assertThat(
        textOutputCallbackMock,
        not(
          textOutputCallback({
            message: "Wrong",
            messageType: "0",
          })
        )
      );
    });
    test("should not match when the provided messageType value is not found", () => {
      assertThat(
        textOutputCallbackMock,
        not(
          textOutputCallback({
            message: "Default message",
            messageType: "2",
          })
        )
      );
    });
    test("Should not match when the callback type is not TextOutputCallback", () => {
      const invalidTextOutputCallbackMock = {
        ...textOutputCallbackMock,
        type: Callbacks.NameCallback,
      };

      assertThat(
        invalidTextOutputCallbackMock,
        not(
          textOutputCallback({
            message: "Default message",
            messageType: "0",
          })
        )
      );
    });
  });
  describe("confirmationCallback unit tests", () => {
    const confirmationCallbackMock = {
      type: Callbacks.ConfirmationCallback,
      output: [
        {
          name: "prompt",
          value: "A prompt",
        },
        {
          name: "messageType",
          value: 0,
        },
        {
          name: "options",
          value: ["Submit", "Start Over", "Cancel"],
        },
        {
          name: "optionType",
          value: -1,
        },
        {
          name: "defaultOption",
          value: 1,
        },
      ],
      input: [
        {
          name: "IDToken1",
          value: 0,
        },
      ],
      _id: 0,
    };
    test("Should match when the callback type is ConfirmationCallback", () => {
      assertThat(confirmationCallbackMock, confirmationCallback({}));
    });
    test("Should match when the callback type is ConfirmationCallback and the provided prompt value is found", () => {
      assertThat(
        confirmationCallbackMock,
        confirmationCallback({ prompt: "A prompt" })
      );
    });
    test("Should match when the callback type is ConfirmationCallback and the provided prompt and messageType values are found", () => {
      assertThat(
        confirmationCallbackMock,
        confirmationCallback({ prompt: "A prompt", messageType: 0 })
      );
    });
    test("Should match when the callback type is ConfirmationCallback and the provided prompt, messageType and options values are found", () => {
      assertThat(
        confirmationCallbackMock,
        confirmationCallback({
          prompt: "A prompt",
          messageType: 0,
          options: ["Submit", "Start Over", "Cancel"],
        })
      );
    });
    test("Should match when the callback type is ConfirmationCallback and the provided prompt, messageType, options and optionType values are found", () => {
      assertThat(
        confirmationCallbackMock,
        confirmationCallback({
          prompt: "A prompt",
          messageType: 0,
          options: ["Submit", "Start Over", "Cancel"],
          optionType: -1,
        })
      );
    });

    test("Should not match when the callback type is not ConfirmationCallback", () => {
      const invalidConfirmationCallbackMock = {
        ...confirmationCallbackMock,
        type: Callbacks.NameCallback,
      };

      assertThat(
        invalidConfirmationCallbackMock,
        not(
          confirmationCallback({
            prompt: "A prompt",
            messageType: 0,
            options: ["Submit", "Start Over", "Cancel"],
            optionType: -1,
          })
        )
      );
    });
    test("Should not match when the provided prompt value is not found", () => {
      assertThat(
        confirmationCallbackMock,
        not(
          confirmationCallback({
            prompt: "A different prompt",
            messageType: 0,
            options: ["Submit", "Start Over", "Cancel"],
            optionType: -1,
          })
        )
      );
    });
    test("Should not match when the provided messageType value is not found", () => {
      assertThat(
        confirmationCallbackMock,
        not(
          confirmationCallback({
            prompt: "A prompt",
            messageType: 8,
            options: ["Submit", "Start Over", "Cancel"],
            optionType: -1,
          })
        )
      );
    });
    test("Should not match when the provided options value is not found", () => {
      assertThat(
        confirmationCallbackMock,
        not(
          confirmationCallback({
            prompt: "A prompt",
            messageType: 0,
            options: ["Submit", "Cancel"],
            optionType: -1,
          })
        )
      );
    });
    test("Should not match when the provided optionType value is not found", () => {
      assertThat(
        confirmationCallbackMock,
        not(
          confirmationCallback({
            prompt: "A prompt",
            messageType: 0,
            options: ["Submit", "Start Over", "Cancel"],
            optionType: 6,
          })
        )
      );
    });
    test("Should not match when the provided values are falsy", () => {
      assertThat(
        confirmationCallbackMock,
        not(
          confirmationCallback({
            prompt: "",
            messageType: 0,
            options: ["Submit", "Start Over", "Cancel"],
            optionType: 0,
          })
        )
      );
    });
  });
  describe("validatedCreatePasswordCallback unit tests", () => {
    const validatedCreatePasswordCallbackMock = {
      type: Callbacks.ValidatedCreatePasswordCallback,
      output: [
        {
          name: "prompt",
          value: "Password",
        },
      ],
      input: [
        {
          name: "IDToken1",
          value: "",
        },
      ],
      _id: 0,
    };
    test("Should match when the callback type is ValidatedCreatePasswordCallback", () => {
      assertThat(
        validatedCreatePasswordCallbackMock,
        validatedCreatePasswordCallback()
      );
    });
    test("Should match when the callback type is ValidatedCreatePasswordCallback and the provided prompt value is found", () => {
      assertThat(
        validatedCreatePasswordCallbackMock,
        validatedCreatePasswordCallback("Password")
      );
    });
    test("Should not match when the provided prompt value is not found", () => {
      assertThat(
        validatedCreatePasswordCallbackMock,
        not(validatedCreatePasswordCallback("wrong prompt"))
      );
    });
    test("Should not match when the provided prompt value is an empty string", () => {
      assertThat(
        validatedCreatePasswordCallbackMock,
        not(validatedCreatePasswordCallback(""))
      );
    });
    test("Should not match when the callback type is not ValidatedCreatePasswordCallback", () => {
      const invalidValidatedCreatePasswordCallbackMock = {
        ...validatedCreatePasswordCallbackMock,
        type: Callbacks.NameCallback,
      };

      assertThat(
        invalidValidatedCreatePasswordCallbackMock,
        not(validatedCreatePasswordCallback())
      );
    });
  });
  describe("choiceCallback unit tests", () => {
    const choiceCallbackMock = {
      type: "ChoiceCallback",
      output: [
        {
          name: "prompt",
          value: "Choose one",
        },
        {
          name: "choices",
          value: ["Choice A", "Choice B", "Choice C"],
        },
        {
          name: "defaultChoice",
          value: 2,
        },
      ],
      input: [
        {
          name: "IDToken1",
          value: 0,
        },
      ],
    };
    test("Should match when the callback type is ChoiceCallback", () => {
      assertThat(choiceCallbackMock, choiceCallback({}));
    });
    test("Should match when the callback type is ChoiceCallback and the provided prompt value is found", () => {
      assertThat(choiceCallbackMock, choiceCallback({ prompt: "Choose one" }));
    });
    test("Should match when the callback type is ChoiceCallback and the provided prompt and choices values are found", () => {
      assertThat(
        choiceCallbackMock,
        choiceCallback({
          prompt: "Choose one",
          choices: ["Choice A", "Choice B", "Choice C"],
        })
      );
    });
    test("Should match when the callback type is ChoiceCallback and the provided prompt, choices and defaultChoice values are found", () => {
      assertThat(
        choiceCallbackMock,
        choiceCallback({
          prompt: "Choose one",
          choices: ["Choice A", "Choice B", "Choice C"],
          defaultChoice: 2,
        })
      );
    });
    test("Should not match when the callback type is not ChoiceCallback", () => {
      const invalidChoiceCallbackMock = {
        ...choiceCallbackMock,
        type: Callbacks.NameCallback,
      };

      assertThat(invalidChoiceCallbackMock, not(choiceCallback({})));
    });
    test("Should not match when the provided prompt value is not found", () => {
      assertThat(
        choiceCallbackMock,
        not(choiceCallback({ prompt: "A different prompt" }))
      );
    });
    test("Should not match when the provided prompt value is an empty string", () => {
      assertThat(choiceCallbackMock, not(choiceCallback({ prompt: "" })));
    });
    test("Should not match when the provided choices value is not found", () => {
      assertThat(
        choiceCallbackMock,
        not(
          choiceCallback({
            choices: ["Choice C", "Choice B"],
          })
        )
      );
    });
    test("Should not match when the provided defaultChoice value is not found", () => {
      assertThat(
        choiceCallbackMock,
        not(
          choiceCallback({
            defaultChoice: 5,
          })
        )
      );
    });
    test("Should not match when the provided defaultChoice value falsy", () => {
      assertThat(
        choiceCallbackMock,
        not(
          choiceCallback({
            defaultChoice: 0,
          })
        )
      );
    });
  });
  describe("hiddenValueCallback unit tests", () => {
    const hiddenValueCallbackMock = {
      type: "HiddenValueCallback",
      output: [
        {
          name: "value",
          value: "6186c911-b3be-4dbc-8192-bdf251392072",
        },
        {
          name: "id",
          value: "jwt",
        },
      ],
      input: [
        {
          name: "IDToken1",
          value: "jwt",
        },
      ],
    };
    test("Should match when the callback type is HiddenValueCallback", () => {
      assertThat(hiddenValueCallbackMock, hiddenValueCallback({}));
    });
    test("Should match when the callback type is HiddenValueCallback and the provided id value is found", () => {
      assertThat(hiddenValueCallbackMock, hiddenValueCallback({ id: "jwt" }));
    });
    test("Should match when the callback type is HiddenValueCallback and the provided id and initial value values are found", () => {
      assertThat(
        hiddenValueCallbackMock,
        hiddenValueCallback({
          id: "jwt",
          initialValue: "6186c911-b3be-4dbc-8192-bdf251392072",
        })
      );
    });
    test("Should not match when the callback type is not HiddenValueCallback", () => {
      const invalidHiddenValueCallbackMock = {
        ...hiddenValueCallbackMock,
        type: Callbacks.NameCallback,
      };

      assertThat(invalidHiddenValueCallbackMock, not(hiddenValueCallback({})));
    });
    test("Should not match when the provided id value is not found", () => {
      assertThat(
        hiddenValueCallbackMock,
        not(hiddenValueCallback({ id: "notjwt" }))
      );
    });
    test("Should not match when the provided id value is an empty string", () => {
      assertThat(hiddenValueCallbackMock, not(hiddenValueCallback({ id: "" })));
    });
    test("Should not mach when the provided initialValue value is not found", () => {
      assertThat(
        hiddenValueCallbackMock,
        not(hiddenValueCallback({ initialValue: "a different value" }))
      );
    });
    test("Should not mach when the provided initialValue value is an empty string", () => {
      assertThat(
        hiddenValueCallbackMock,
        not(hiddenValueCallback({ initialValue: "" }))
      );
    });
  });
  describe("validatedCreateUsernameCallback unit tests", () => {
    const validatedCreateUsernameCallbackMock = {
      type: "ValidatedCreateUsernameCallback",
      output: [
        {
          name: "policies",
          value: {
            policyRequirements: [
              "REQUIRED",
              "VALID_TYPE",
              "VALID_USERNAME",
              "CANNOT_CONTAIN_CHARACTERS",
              "MIN_LENGTH",
              "MAX_LENGTH",
            ],
            fallbackPolicies: null,
            name: "userName",
            policies: [
              {
                policyRequirements: ["REQUIRED"],
                policyId: "required",
              },
              {
                policyRequirements: ["VALID_TYPE"],
                policyId: "valid-type",
                params: {
                  types: ["string"],
                },
              },
              {
                policyId: "valid-username",
                policyRequirements: ["VALID_USERNAME"],
              },
              {
                policyId: "cannot-contain-characters",
                params: {
                  forbiddenChars: ["/"],
                },
                policyRequirements: ["CANNOT_CONTAIN_CHARACTERS"],
              },
              {
                policyId: "minimum-length",
                params: {
                  minLength: 1,
                },
                policyRequirements: ["MIN_LENGTH"],
              },
              {
                policyId: "maximum-length",
                params: {
                  maxLength: 255,
                },
                policyRequirements: ["MAX_LENGTH"],
              },
            ],
            conditionalPolicies: null,
          },
        },
        {
          name: "failedPolicies",
          value: [],
        },
        {
          name: "validateOnly",
          value: false,
        },
        {
          name: "prompt",
          value: "Username",
        },
      ],
      input: [
        {
          name: "IDToken1",
          value: "",
        },
        {
          name: "IDToken1validateOnly",
          value: false,
        },
      ],
    };
    test("Should match when the callback type is ValidatedCreateUsernameCallback", () => {
      assertThat(
        validatedCreateUsernameCallbackMock,
        validatedCreateUsernameCallback()
      );
    });
    test("Should not match when the callback type is not ValidatedCreateUsername", () => {
      const invalidValidatedCreatePasswordCallbackMock = {
        ...validatedCreateUsernameCallbackMock,
        type: Callbacks.NameCallback,
      };

      assertThat(
        invalidValidatedCreatePasswordCallbackMock,
        not(validatedCreateUsernameCallback())
      );
    });
  });
  describe("stringAttributeCallback unit tests", () => {
    const stringAttributeCallbackMock = {
      type: "StringAttributeInputCallback",
      output: [
        {
          name: "name",
          value: "givenName",
        },
        {
          name: "prompt",
          value: "First Name",
        },
        {
          name: "required",
          value: true,
        },
        {
          name: "policies",
          value: {
            policyRequirements: ["REQUIRED", "VALID_TYPE"],
            fallbackPolicies: null,
            name: "givenName",
            policies: [
              {
                policyRequirements: ["REQUIRED"],
                policyId: "required",
              },
              {
                policyRequirements: ["VALID_TYPE"],
                policyId: "valid-type",
                params: {
                  types: ["string"],
                },
              },
            ],
            conditionalPolicies: null,
          },
        },
        {
          name: "failedPolicies",
          value: [],
        },
        {
          name: "validateOnly",
          value: false,
        },
        {
          name: "value",
          value: "",
        },
      ],
      input: [
        {
          name: "IDToken1",
          value: "",
        },
        {
          name: "IDToken1validateOnly",
          value: false,
        },
      ],
    };
    test("Should match when the callback type is StringAttributeInputCallback", () => {
      assertThat(stringAttributeCallbackMock, stringAttributeInputCallback());
    });
    test("Should not match when the callback type is not StringAttributeInputCallback", () => {
      const invalidStringAttributeCallbackMock = {
        ...stringAttributeCallbackMock,
        type: Callbacks.NameCallback,
      };

      assertThat(
        invalidStringAttributeCallbackMock,
        not(stringAttributeInputCallback())
      );
    });
  });
  describe("termsAndConditionsCallback unit tests", () => {
    const termsAndConditionsCallbackMock = {
      type: "TermsAndConditionsCallback",
      output: [
        {
          name: "version",
          value: "0.0",
        },
        {
          name: "terms",
          value: "Terms and conditions text that customers must agree to.",
        },
        {
          name: "createDate",
          value: "2019-10-28T04:20:11.320Z",
        },
      ],
      input: [
        {
          name: "IDToken1",
          value: false,
        },
      ],
    };
    test("Should match when the callback type is termsAndConditionsCallback", () => {
      assertThat(
        termsAndConditionsCallbackMock,
        termsAndConditionsCallback({})
      );
    });
    test("Should match when the callback type is termsAndConditionsCallback and the provided version value is found", () => {
      assertThat(
        termsAndConditionsCallbackMock,
        termsAndConditionsCallback({ version: "0.0" })
      );
    });
    test("Should match when the callback type is termsAndConditionsCallback and the provided version and terms values are found", () => {
      assertThat(
        termsAndConditionsCallbackMock,
        termsAndConditionsCallback({
          version: "0.0",
          terms: "Terms and conditions text that customers must agree to.",
        })
      );
    });
    test("Should match when the callback type is termsAndConditionsCallback and the provided version, terms and createDate values are found", () => {
      assertThat(
        termsAndConditionsCallbackMock,
        termsAndConditionsCallback({
          version: "0.0",
          terms: "Terms and conditions text that customers must agree to.",
          createDate: "2019-10-28T04:20:11.320Z",
        })
      );
    });
    test("Should not match when the callback type is not termsAndConditionsCallback", () => {
      const invalidTermsAndConditionsCallbackMock = {
        ...termsAndConditionsCallbackMock,
        type: Callbacks.NameCallback,
      };

      assertThat(
        invalidTermsAndConditionsCallbackMock,
        not(termsAndConditionsCallback({}))
      );
    });
    test("Should not match when the provided version value is not found", () => {
      assertThat(
        termsAndConditionsCallbackMock,
        not(
          termsAndConditionsCallback({
            version: "5",
          })
        )
      );
    });
    test("Should not match when the provided version value is an empty string", () => {
      assertThat(
        termsAndConditionsCallbackMock,
        not(
          termsAndConditionsCallback({
            version: "",
          })
        )
      );
    });
    test("Should not match when the provided terms value is not found", () => {
      assertThat(
        termsAndConditionsCallbackMock,
        not(
          termsAndConditionsCallback({
            terms: "Different  terms and conditions",
          })
        )
      );
    });
    test("Should not match when the provided terms value is an empty string", () => {
      assertThat(
        termsAndConditionsCallbackMock,
        not(
          termsAndConditionsCallback({
            terms: "",
          })
        )
      );
    });
    test("Should not match when the provided createDate value is not found", () => {
      assertThat(
        termsAndConditionsCallbackMock,
        not(
          termsAndConditionsCallback({
            createDate: "The wrong date, or not a date at all",
          })
        )
      );
    });
    test("Should not match when the provided createDate value is an empty string", () => {
      assertThat(
        termsAndConditionsCallbackMock,
        not(
          termsAndConditionsCallback({
            createDate: "",
          })
        )
      );
    });
  });
});
