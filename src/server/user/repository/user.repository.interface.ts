import type { IRepository } from "../../../common";
import type { UserModel } from "../model";

type IUserRepositoryQuery = {
  id: string;
};

interface IUserRepository extends IRepository<UserModel, IUserRepositoryQuery, UserModel> {}

export type { IUserRepository, IUserRepositoryQuery };
