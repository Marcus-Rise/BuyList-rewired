import { ContainerModule } from "inversify";
import type { IUserConfig } from "../config";
import { USER_CONFIG, UserConfig } from "../config";
import type { IUserRepository } from "../repository";
import { USER_REPOSITORY, UserRepository } from "../repository";
import type { IUserService } from "../service";
import { USER_SERVICE, UserService } from "../service";

const UserModule = new ContainerModule((bind) => {
  bind<IUserConfig>(USER_CONFIG).to(UserConfig).inSingletonScope();
  bind<IUserRepository>(USER_REPOSITORY).to(UserRepository).inSingletonScope();
  bind<IUserService>(USER_SERVICE).to(UserService).inSingletonScope();
});

export { UserModule };
