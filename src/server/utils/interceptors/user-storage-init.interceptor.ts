import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import type { IUserService } from "../../user";
import { USER_SERVICE } from "../../user";
import type { IJsonStorageService } from "../../json-storage";
import { JSON_STORAGE_SERVICE } from "../../json-storage";
import { getSession } from "@auth0/nextjs-auth0";
import type { NextInterceptor } from "./interceptor";
import { container } from "../../ioc";

const withUserStorageInitialization: NextInterceptor =
  (
    handler: NextApiHandler,
    userService = container.get<IUserService>(USER_SERVICE),
    jsonStorageService = container.get<IJsonStorageService>(JSON_STORAGE_SERVICE),
  ) =>
  async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const session = getSession(req, res);

    if (!session) {
      return res.status(401).json("unauthorized");
    }

    await userService.load(session.user.sub);

    if (!userService.user.jsonStorageId) {
      const id = await jsonStorageService.create({ test: "data" });

      await userService.saveJsonStorageId(id);
    }

    return handler(req, res);
  };

export { withUserStorageInitialization };
