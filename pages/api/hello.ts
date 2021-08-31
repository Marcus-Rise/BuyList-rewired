import type { NextApiHandler } from "next";
import type { IUserService } from "../../src/server/user";
import { USER_SERVICE } from "../../src/server/user";
import type { IJsonStorageService } from "../../src/server/json-storage";
import { JSON_STORAGE_SERVICE } from "../../src/server/json-storage";
import { withBaseInterceptor } from "../../src/server/utils/interceptors";
import { container } from "../../src/server/ioc";

const handler: NextApiHandler = async (
  req,
  response,
  userService = container.get<IUserService>(USER_SERVICE),
  jsonStorageService = container.get<IJsonStorageService>(JSON_STORAGE_SERVICE),
) => jsonStorageService.read(userService.user.jsonStorageId).then(response.send);

export default withBaseInterceptor(handler);
