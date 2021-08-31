import type { IJsonStorageService } from "./json-storage.service.interface";
import type { IJsonStorageConfig } from "../config";
import { JsonStorageException } from "../json-storage.exception";

interface IJsonStorageError {
  status: number;
  title: string;
}

class JsonStorageService implements IJsonStorageService {
  constructor(private readonly _config: IJsonStorageConfig) {}

  static isError(obj: unknown): obj is IJsonStorageError {
    return typeof obj === "object" && obj !== null && "status" in obj && "title" in obj;
  }

  async create<T = Record<string, unknown>>(initData: T): Promise<string> {
    const { apiUrl } = this._config;

    const { uri } = await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(initData),
      headers: {
        "Content-Type": "application/json",
      },
    }).then<{ uri: string }>(async ({ json }) => {
      const data = await json();

      if (JsonStorageService.isError(data)) {
        throw new JsonStorageException(data.title, data.status);
      }

      return data;
    });

    return uri.split("/").slice(-1)[0];
  }

  async read<T = Record<string, unknown>>(id: string): Promise<T> {
    const { apiUrl } = this._config;

    return fetch(apiUrl + "/" + id).then(async ({ json }) => {
      const data = await json();

      if (JsonStorageService.isError(data)) {
        throw new JsonStorageException(data.title, data.status);
      }

      return data;
    });
  }

  async update<T = Record<string, unknown>>(id: string, data: T): Promise<void> {
    const { apiUrl } = this._config;

    return fetch(apiUrl + "/" + id, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async ({ json }) => {
      const data = await json();

      if (JsonStorageService.isError(data)) {
        throw new JsonStorageException(data.title, data.status);
      }

      return data;
    });
  }
}

export { JsonStorageService };
