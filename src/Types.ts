import { Matcher, PropertiesMatcher } from "hamjest";

export enum CallbackType {
  BooleanAttributeInputCallback = "BooleanAttributeInputCallback",
  ChoiceCallback = "ChoiceCallback",
  ConfirmationCallback = "ConfirmationCallback",
  DeviceProfileCallback = "DeviceProfileCallback",
  HiddenValueCallback = "HiddenValueCallback",
  KbaCreateCallback = "KbaCreateCallback",
  MetadataCallback = "MetadataCallback",
  NameCallback = "NameCallback",
  NumberAttributeInputCallback = "NumberAttributeInputCallback",
  PasswordCallback = "PasswordCallback",
  PollingWaitCallback = "PollingWaitCallback",
  ReCaptchaCallback = "ReCaptchaCallback",
  RedirectCallback = "RedirectCallback",
  SelectIdPCallback = "SelectIdPCallback",
  StringAttributeInputCallback = "StringAttributeInputCallback",
  SuspendedTextOutputCallback = "SuspendedTextOutputCallback",
  TermsAndConditionsCallback = "TermsAndConditionsCallback",
  TextInputCallback = "TextInputCallback",
  TextOutputCallback = "TextOutputCallback",
  ValidatedCreatePasswordCallback = "ValidatedCreatePasswordCallback",
  ValidatedCreateUsernameCallback = "ValidatedCreateUsernameCallback",
}

export enum ActionType {
  createOTP = "createOTP",
  setNameCallbackValue = "setNameCallbackValue",
  setPasswordCallbackValue = "setPasswordCallbackValue",
  checkEmail = "checkEmail",
  setOTP = "setOTP",
  setCallbackValue = "setCallbackValue",
  saveOtpAuthURI = "saveOtpAuthURI",
}

export type NameValuePair = {
  name: string;
  value: string | number | boolean | null | string[];
};

export type Callback = {
  _id?: number | null;
  type: CallbackType;
  input?: NameValuePair[];
  output?: NameValuePair[];
};

export type AuthenticateResponse = {
  callbacks: Callback[];
  authId: string;
  header?: string;
  description?: string;
  stage?: string;
  tokenId?: string;
};

export type ClientConfig = {
  clientId?: string;
  jwtIssuer?: string;
  privateKey?: string;
  scope?: string;
};

export type StepOperations = {
  actions?: Action[];
  validation?: {
    callbacks?: Matcher[];
    response?: PropertiesMatcher[];
    error?: PropertiesMatcher[];
  };
};

export type JourneyStep = {
  name: string;
  preStep?: StepOperations;
  postStep?: StepOperations;
};

export type Action = {
  action: ActionType;
  callbackType?: CallbackType;
  checkEmailParams?: {
    sender?: string;
    subject?: string;
    emailParser?: (str: string) => string;
    timeDelay?: number;
  };
  value?: string;
};

export type TemplateKeys<T extends string> =
  T extends `${infer _Start}{${infer Key}}${infer End}`
    ? (Key extends string ? Key : never) | TemplateKeys<End>
    : never;

export type User = {
  _id: string;
  custom_mfa: {
    sms: {
      verified: boolean;
      dateAdded: string;
      telephoneNumber: string;
    }[];
    voice: any[];
  };
  country: string | null;
  frUnindexedString1: string | null;
  mail: string;
  memberOfOrgIDs: string[];
  frIndexedDate5: string | null;
  frUnindexedString2: string | null;
  frIndexedDate4: string | null;
  frUnindexedString3: string | null;
  frIndexedDate3: string | null;
  frUnindexedString4: string | null;
  postalCode: string | null;
  frUnindexedString5: string | null;
  profileImage: string | null;
  frIndexedString5: string | null;
  frIndexedString4: string | null;
  frIndexedString3: string | null;
  frIndexedString2: string | null;
  frIndexedString1: string | null;
  frIndexedMultivalued3: string[];
  frUnindexedInteger5: number | null;
  consentedMappings: string[];
  frIndexedMultivalued4: string[];
  frUnindexedInteger4: number | null;
  frIndexedMultivalued5: string[];
  frUnindexedInteger3: number | null;
  frUnindexedInteger2: number | null;
  effectiveGroups: string[];
  frIndexedMultivalued1: string[];
  frIndexedMultivalued2: string[];
  frUnindexedInteger1: number | null;
  givenName: string;
  stateProvince: string | null;
  postalAddress: string | null;
  telephoneNumber: string;
  city: string | null;
  effectiveAssignments: string[];
  description: string | null;
  effectiveApplications: string[];
  accountStatus: string;
  frUnindexedDate3: string | null;
  frUnindexedMultivalued1: string[];
  frUnindexedDate2: string | null;
  passwordExpirationTime: string;
  frUnindexedDate5: string | null;
  frUnindexedMultivalued3: string[];
  frUnindexedDate4: string | null;
  frUnindexedMultivalued2: string[];
  aliasList: string[];
  frUnindexedMultivalued5: string[];
  frUnindexedMultivalued4: string[];
  kbaInfo: any[];
  frIndexedInteger4: number | null;
  frIndexedInteger3: number | null;
  frIndexedInteger2: number | null;
  frIndexedInteger1: number | null;
  sn: string;
  frUnindexedDate1: string | null;
  frIndexedInteger5: number | null;
  preferences: any | null;
  userName: string;
  frIndexedDate2: string | null;
  passwordLastChangedTime: string;
  frIndexedDate1: string | null;
  effectiveRoles: string[];
  manager: string | null;
};
