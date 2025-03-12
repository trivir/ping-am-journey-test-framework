import { AMInstance, CloudServiceAccountAuthStrategy } from "../AM/amInstance";
import { AMRealm } from "../AM/amRealm";
import { loadConfig } from "../config";
import { Journey } from "../Journey/journey";
import { processJourneySteps } from "../Journey/journeyUtils";
import { JourneyStep, User } from "../Types";
import { CloudAmAuth, IDMInstance } from "./idmInstance";
import { ManagedObject } from "./managedObject";

/**
 * create a user session and get the tokenId
 * @param options required options to create a user session
 * @param options.journey the journey that will be used to login the specified user
 * @param options.username the username of the user that will be used to create the session
 * @param options.password the password of the user that will be used to create the session
 * @returns the tokenId of the user session
 */
export async function createUserSession({
  journey,
  steps,
}: {
  journey: Journey;
  steps: JourneyStep[];
}) {
  await processJourneySteps(journey, steps);

  await journey.nextStep();

  return journey.lastResponse?.tokenId;
}

/**
 * delete a specific user
 * @param options options required to delete a specified user
 * @param options.users a managedObject instance that may contain the specified user
 * @param options.id the id of the user that should be deleted
 */
export async function deleteUser({
  users,
  id,
}: {
  users: ManagedObject<User>;
  id: string;
}) {
  try {
    await users.delete(id);
  } catch (error: any) {}
}

/**
 * create a managed users instance
 * @param options options required to create a managed users inistance
 * @param options.amUrl the url for the am instance that the users belong to
 * @param options.realmName the name of the realm that the users belong to
 * @returns an object with
 */
export async function createManagedUsersInstance({
  amUrl,
  realmName,
}: {
  amUrl?: string;
  realmName: string;
}) {
  const { BASE_URL } = loadConfig();

  const AM = new AMInstance(
    amUrl ?? BASE_URL,
    new CloudServiceAccountAuthStrategy()
  );

  const IDM = new IDMInstance(amUrl ?? BASE_URL, new CloudAmAuth(AM));

  const realm = new AMRealm(realmName, AM);

  return {
    usersManagedObject: new ManagedObject<User>(IDM, `${realmName}_user`),
    realm: realm,
  };
}

export async function generateUserSessionHeaders({
  journeyName,
  realm,
  steps,
}: {
  journeyName: string;
  realm: AMRealm;
  steps: JourneyStep[];
}) {
  const journey = new Journey(journeyName, realm);

  const userTokenId = await createUserSession({
    journey,
    steps,
  });

  const { COOKIE_NAME } = loadConfig();

  return {
    ForceAuth: "true",
    Cookie: `${COOKIE_NAME}=${userTokenId}`,
  };
}
