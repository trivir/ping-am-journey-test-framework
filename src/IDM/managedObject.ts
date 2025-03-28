import type { OptionsOfTextResponseBody } from "got";
import { Logger } from "../Utils/logger";
import type { IDMInstance } from "./idmInstance";

export class ManagedObject<T> {
	private idmInstance: IDMInstance;
	private objectType: string;

	constructor(idmInstance: IDMInstance, objectType: string) {
		this.idmInstance = idmInstance;
		this.objectType = objectType;
	}

	public async request(
		url: string,
		options: OptionsOfTextResponseBody,
		authenticate = true,
	) {
		try {
			const logger = Logger.getInstance();
			const urlPath = `/openidm/managed/${this.objectType}${url}`;

			logger.log("Managed object request:", urlPath, options);

			return await this.idmInstance.request(urlPath, options, authenticate);
		} catch (error) {
			console.log(
				"Error in managedObject request:",
				`/openidm/managed/${this.objectType}${url}`,
				JSON.stringify(error, Object.getOwnPropertyNames(error)),
			);
		}
	}

	public async read(objectId: string): Promise<T> {
		return (await this.request(`/${objectId}`, { method: "GET" })) as T;
	}

	public async create(attrs: unknown) {
		const requestOptions: OptionsOfTextResponseBody = {
			method: "POST",
			searchParams: {
				_action: "create",
			},
			json: attrs,
		};

		return await this.request("", requestOptions);
	}

	public async delete(objectId: string) {
		return this.request(`/${objectId}`, { method: "DELETE" });
	}

	public async put(objectId: string, attrs: unknown) {
		return this.request(`/${objectId}`, { method: "PUT", json: attrs });
	}

	public async patch(objectId: string, attrs: unknown) {
		return this.request(`/${objectId}`, { method: "PATCH", json: attrs });
	}
}
