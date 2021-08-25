import { UserService } from "./service";
import { UserConfig } from "./config";
import { UserRepository } from "./repository";

export type { IUserService } from "./service";
export * from "./model";

const User = new UserService(new UserRepository(new UserConfig()));

export { User };
