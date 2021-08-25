import type { NextApiRequest, NextApiResponse } from "next";
import type { IUserService } from "../../user";
import { User } from "../../user";
import type { IJsonStorageService } from "../../json-storage";
import { JsonStorage } from "../../json-storage";
import { getSession } from "@auth0/nextjs-auth0";

const userStorageInitInterceptor = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userService: IUserService = User,
  jsonStorageService: IJsonStorageService = JsonStorage,
) => {
  const session = getSession(req, res);

  if (!session) {
    return res.status(401).json("unauthorized");
  }

  await userService.load(session.user.sub);

  if (!userService.user.jsonStorageId) {
    const id = await jsonStorageService.create({ test: "data" });

    await userService.saveJsonStorageId(id);
  }
};

export { userStorageInitInterceptor };
