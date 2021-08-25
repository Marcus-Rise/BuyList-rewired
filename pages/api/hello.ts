import type { NextApiHandler } from "next";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { IUserService } from "../../src/server/user";
import type { AbstractException } from "../../src/server/utils/exception";
import { UserRepository } from "../../src/server/user/repository";
import { UserService } from "../../src/server/user/service";
import { UserConfig } from "../../src/server/user/config";
import type { IJsonStorageService } from "../../src/server/json-storage";
import { JsonStorageService } from "../../src/server/json-storage/service";
import { JsonStorageConfig } from "../../src/server/json-storage/config";

const handler: NextApiHandler = async (
  req,
  response,
  userService: IUserService = new UserService(new UserRepository(new UserConfig())),
  jsonStorageService: IJsonStorageService = new JsonStorageService(new JsonStorageConfig()),
) => {
  const session = getSession(req, response);

  if (!session) {
    return response.status(401).json("unauthorized");
  }

  return userService
    .load(session.user.sub)
    .then(async () => {
      if (!userService.user.jsonStorageId) {
        const id = await jsonStorageService.create({ test: "data" });

        await userService.saveJsonStorageId(id);
      }

      const data = await jsonStorageService.read(userService.user.jsonStorageId);

      response.status(200).json(data);
    })
    .catch((error: AbstractException) => {
      console.error(error);

      return response.status(error.code).json(error.errorParsed);
    });
};

export default withApiAuthRequired(handler);
