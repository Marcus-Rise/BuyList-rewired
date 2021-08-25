import { JsonStorageService } from "./service";
import { JsonStorageConfig } from "./config";

export type { IJsonStorageService } from "./service";

const JsonStorage = new JsonStorageService(new JsonStorageConfig());

export { JsonStorage };
