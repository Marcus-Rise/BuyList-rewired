import type { NextApiHandler } from "next";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { IUserService } from "../../src/server/user";
import { UserConfig, UserService } from "../../src/server/user";
import type { AbstractException } from "../../src/server/utils/exception";

const handler: NextApiHandler = async (
  req,
  response,
  userService: IUserService = new UserService(new UserConfig()),
) => {
  const session = getSession(req, response);

  if (!session) {
    return response.status(401).json("unauthorized");
  }

  return userService
    .load(session.user.sub)
    .then(() => response.status(200).json(userService.user))
    .catch((error: AbstractException) => {
      console.error(error);

      return response.status(error.code).json(error.errorParsed);
    });
};

export default withApiAuthRequired(handler);
