import type { OptionsOfTextResponseBody } from "got";
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
			const urlPath = `/openidm/managed/${this.objectType}${url}`;

			return await this.idmInstance.request(urlPath, options, authenticate);
		} catch (error) {}
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
