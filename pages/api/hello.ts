import type { NextApiHandler } from "next";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { IUserService } from "../../src/server/user";
import { User } from "../../src/server/user";
import type { AbstractException } from "../../src/server/utils/exception";
import type { IJsonStorageService } from "../../src/server/json-storage";
import { JsonStorage } from "../../src/server/json-storage";
import { userStorageInitInterceptor } from "../../src/server/utils/interceptors";

const handler: NextApiHandler = async (
  req,
  response,
  userService: IUserService = User,
  jsonStorageService: IJsonStorageService = JsonStorage,
) =>
  userStorageInitInterceptor(req, response)
    .then(() => jsonStorageService.read(userService.user.jsonStorageId))
    .then(response.status(200).json)
    .catch((error: AbstractException) => {
      console.error(error);

      return response.status(error.code).json(error.errorParsed);
    });

export default withApiAuthRequired(handler);
