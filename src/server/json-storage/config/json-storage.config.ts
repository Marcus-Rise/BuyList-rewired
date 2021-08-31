import type { IJsonStorageConfig } from "./json-storage.config.interface";
import { injectable } from "inversify";

@injectable()
class JsonStorageConfig implements IJsonStorageConfig {
  constructor(public readonly apiUrl: string = process.env.JSON_STORAGE_API_URL ?? "") {}
}

export { JsonStorageConfig };
