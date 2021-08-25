import { UserModel } from "../model";
import type { IUserService } from "./user.service.interface";
import { UserException } from "./user.exception";
import type { IUserRepository } from "../repository";

class UserService implements IUserService {
  constructor(private readonly _repo: IUserRepository) {}

  private _user: UserModel = new UserModel();

  get user(): UserModel {
    return this._user;
  }

  async load(userId: string): Promise<void> {
    const user = await this._repo.find({ id: userId });

    if (!user) {
      throw new UserException("user not found", 404);
    }

    this._user = user;
  }
}

export { UserService };
