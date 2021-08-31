import "reflect-metadata";
import type { IUserService } from "../../src/server/user";
import { USER_SERVICE } from "../../src/server/user";
import type { IJsonStorageService } from "../../src/server/json-storage";
import { JSON_STORAGE_SERVICE } from "../../src/server/json-storage";
import type { IHandler } from "../../src/server/utils/interceptors";
import { withBaseInterceptor } from "../../src/server/utils/interceptors";
import type { NextApiRequest, NextApiResponse } from "next";
import { inject, injectable } from "inversify";
import { getSession } from "@auth0/nextjs-auth0";
import type { IProductListJsonDto } from "../../src/common";

@injectable()
class HelloHandler implements IHandler {
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

    const data = await this._jsonStorage.read(this._user.user.jsonStorageId);

    return res.status(200).json(data);
  }
}

export default withBaseInterceptor(HelloHandler);
