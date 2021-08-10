import type { UserModel } from "../model";

interface IUserService {
  get(userId: string): Promise<UserModel>;
}

export type { IUserService };
