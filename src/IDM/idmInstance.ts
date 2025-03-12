import got, { OptionsOfTextResponseBody } from "got";
import { AMInstance } from "../AM/amInstance";

export class IDMInstance {
  private baseUrl: String;
  private authStrategy: AuthStrategy;

  constructor(baseUrl: string, authStrategy: AuthStrategy) {
    this.baseUrl = baseUrl;
    this.authStrategy = authStrategy;
  }

  get authHeader() {
    return this.authStrategy.getAuthHeader();
  }

  public async request(
    endpoint: string,
    options: OptionsOfTextResponseBody,
    authenticate: Boolean = false
  ) {
    const authHeader = await this.authStrategy.getAuthHeader();

    const requestOptions = {
      ...options,
      headers: authenticate ? authHeader : {},
    };

    return got(`${this.baseUrl}${endpoint}`, requestOptions).json();
  }
}

interface AuthStrategy {
  getAuthHeader(): Promise<{ [key: string]: string }>;
}

export class CloudAmAuth {
  private amInstance: AMInstance;

  constructor(amInstance: AMInstance) {
    this.amInstance = amInstance;
  }

  getAuthHeader() {
    return this.amInstance.authHeader;
  }
}
