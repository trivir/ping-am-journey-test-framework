import { Headers, SearchParameters } from "got";
import { AMInstance } from "../AM/amInstance";
import { AMRealm } from "../AM/amRealm";
import { ActionType, JourneyStep, StepOperations } from "../Types";
import { Journey } from "./journey";
import { loadConfig } from "../config";
import * as OTPAuth from "otpauth";
import {
  checkEmail,
  createOTP,
  saveOtpAuthURI,
  setCallbackValue,
  setNameCallbackValue,
  setOTP,
  setPasswordCallbackValue,
} from "./actions";

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
  realmName: string;
  journeyName: string;
  headers?: Headers;
  queryParams?: SearchParameters;
  steps: JourneyStep[];
  cookieParams?: { key: string; value: string };
}) {
  const { BASE_URL } = loadConfig();

  const am = new AMInstance(amUrl ?? BASE_URL);
  const realm = new AMRealm(realmName, am);
  const journey = new Journey(
    journeyName,
    realm,
    headers,
    queryParams,
    cookieParams
  );

  const preProcessedJourneySteps = preProcessJourneySteps(steps);

  await processJourneySteps(journey, preProcessedJourneySteps);
}

function preProcessJourneySteps(
  steps: (JourneyStep | (() => JourneyStep))[]
): JourneyStep[] {
  return steps.flatMap((step) => (typeof step === "function" ? step() : step));
}

export async function processJourneySteps(
  journey: Journey,
  steps: JourneyStep[]
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
        "postStep"
      );
    }
  }
}

export async function processStepOperations(
  journey: Journey,
  stepOperations: StepOperations,
  stepName: string,
  stage: string
) {
  if (stepOperations.validation) {
    if (stepOperations.validation.error) {
      journey.validateError(stepOperations.validation.error, stepName, stage);
    }

    if (stepOperations.validation.response) {
      journey.validateResponse(
        stepOperations.validation.response,
        stepName,
        `${stage} validation response`
      );
    }

    if (stepOperations.validation.callbacks) {
      journey.validateCallbacks(
        stepOperations.validation.callbacks,
        stepName,
        `${stage} validation callbacks`
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
  [ActionType.createOTP]: createOTP,
  [ActionType.setNameCallbackValue]: setNameCallbackValue,
  [ActionType.setPasswordCallbackValue]: setPasswordCallbackValue,
  [ActionType.checkEmail]: checkEmail,
  [ActionType.setOTP]: setOTP,
  [ActionType.setCallbackValue]: setCallbackValue,
  [ActionType.saveOtpAuthURI]: saveOtpAuthURI,
};

export function generateOTP(otpAuthURI: string) {
  const totp = OTPAuth.URI.parse(otpAuthURI);

  return totp.generate();
}

export function stepMessageBuilder(
  stepName: string,
  stage: string,
  action: string,
  message: string
) {
  return `
  Step: ${stepName}.
  Stage: ${stage}
  Action: ${action}
  Message: ${message}`;
}
