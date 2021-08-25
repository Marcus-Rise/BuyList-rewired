import type { UserModel } from "../model";

interface IUserService {
  readonly user: UserModel;

  load(userId: string): Promise<void>;

  saveJsonStorageId(url: string): Promise<void>;
}

export type { IUserService };
