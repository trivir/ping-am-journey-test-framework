import jose from "node-jose";
import { v4 as uuid } from "uuid";
import got, { OptionsOfTextResponseBody } from "got";
import { ClientConfig } from "../Types";

const PrivateKeyFormat = {
  JWK: "JWK",
  PEM: "PEM",
};

const JWT_VALIDITY_SECONDS = 180;

function getPrivateKeyFormat(privateKey: string) {
  return privateKey.startsWith("-----BEGIN RSA PRIVATE KEY-----")
    ? PrivateKeyFormat.PEM
    : PrivateKeyFormat.JWK;
}

async function getToken(
  tenantUrl: string | undefined,
  clientConfig: ClientConfig
) {
  const tokenEndpoint = `${tenantUrl}/am/oauth2/access_token`;
  try {
    const payload = {
      iss: clientConfig.jwtIssuer,
      sub: clientConfig.jwtIssuer,
      aud: tokenEndpoint,
      jti: uuid(),
      exp: Math.floor(new Date().getTime() / 1000) + JWT_VALIDITY_SECONDS,
    };

    var key;

    if (!clientConfig.privateKey) {
      console.error("Private key not defined");
      process.exit(1);
    }

    if (getPrivateKeyFormat(clientConfig.privateKey) === PrivateKeyFormat.JWK) {
      key = await jose.JWK.asKey(JSON.parse(clientConfig.privateKey));
    } else {
      var keystore = jose.JWK.createKeyStore();
      key = await keystore.add(clientConfig.privateKey, "pem");
    }

    const jwt = await jose.JWS.createSign(
      { alg: "RS256", compact: true, fields: {} },
      //@ts-ignore
      { key, reference: false }
    )
      .update(JSON.stringify(payload))
      .final();

    const formData = {
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      client_id: clientConfig.clientId,
      scope: clientConfig.scope,
      assertion: jwt,
    };

    const options: OptionsOfTextResponseBody = {
      method: "POST",
      form: formData,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    };

    const data = (await got(tokenEndpoint, options).json()) as any;

    return data.access_token;
  } catch (err: any) {
    console.error(
      err.message,
      err.response ? err.response.data : "No response data"
    );
    process.exit(1);
  }
}

export { getToken };
