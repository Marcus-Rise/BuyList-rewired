import { inject, injectable } from "inversify";
import type { IUserService } from "../../user";
import { USER_SERVICE } from "../../user";
import type { IJsonStorageService } from "../../json-storage";
import { JSON_STORAGE_SERVICE } from "../../json-storage";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@auth0/nextjs-auth0";
import type { IProductListJsonDto } from "../../../common";
import type { IHandler } from "../handler";
import { nextHandlerFactory } from "../handler";
import type { Interceptor } from "./index";

@injectable()
class UserJsonStorageHandler implements IHandler {
  constructor(
    @inject(USER_SERVICE) private readonly _user: IUserService,
    @inject(JSON_STORAGE_SERVICE) private readonly _jsonStorage: IJsonStorageService,
  ) {}

  async handle(req: NextApiRequest, res: NextApiResponse) {
    const session = getSession(req, res);

    if (!session) {
      return res.status(401).json("unauthorized");
    }

    await this._user.load(session.user.sub);

    if (!this._user.user.jsonStorageId) {
      const id = await this._jsonStorage.create<IProductListJsonDto>({ items: [] });

      await this._user.saveJsonStorageId(id);
    }
  }
}

const userJsonStorageHandler = nextHandlerFactory(UserJsonStorageHandler);

const userJsonStorageInterceptor: Interceptor = (handler) => async (req, res) => {
  await userJsonStorageHandler(req, res);

  await handler(req, res);
};

export { userJsonStorageInterceptor as withUserJsonStorage };
