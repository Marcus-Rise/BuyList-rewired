import { ContainerModule } from "inversify";
import type { IJsonStorageConfig } from "../config";
import { JSON_STORAGE_CONFIG, JsonStorageConfig } from "../config";
import type { IJsonStorageService } from "../service";
import { JSON_STORAGE_SERVICE, JsonStorageService } from "../service";

const JsonStorageModule = new ContainerModule((bind) => {
  bind<IJsonStorageConfig>(JSON_STORAGE_CONFIG).to(JsonStorageConfig).inSingletonScope();
  bind<IJsonStorageService>(JSON_STORAGE_SERVICE).to(JsonStorageService).inSingletonScope();
});

export { JsonStorageModule };
