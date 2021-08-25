import type { NextApiHandler } from "next";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { IUserService } from "../../src/server/user";
import { User } from "../../src/server/user";
import type { IJsonStorageService } from "../../src/server/json-storage";
import { JsonStorage } from "../../src/server/json-storage";
import {
  withErrorHandle,
  withUserStorageInitialization,
} from "../../src/server/utils/interceptors";

const handler: NextApiHandler = async (
  req,
  response,
  userService: IUserService = User,
  jsonStorageService: IJsonStorageService = JsonStorage,
) => jsonStorageService.read(userService.user.jsonStorageId).then(response.send);

export default withApiAuthRequired(withErrorHandle(withUserStorageInitialization(handler)));
