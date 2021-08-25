import type { NextApiHandler } from "next";
import type { IUserService } from "../../src/server/user";
import { User } from "../../src/server/user";
import type { IJsonStorageService } from "../../src/server/json-storage";
import { JsonStorage } from "../../src/server/json-storage";
import { withBaseInterceptor } from "../../src/server/utils/interceptors";

const handler: NextApiHandler = async (
  req,
  response,
  userService: IUserService = User,
  jsonStorageService: IJsonStorageService = JsonStorage,
) => jsonStorageService.read(userService.user.jsonStorageId).then(response.send);

export default withBaseInterceptor(handler);
