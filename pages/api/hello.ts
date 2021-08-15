import type { NextApiHandler } from "next";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { IUserService } from "../../src/server/user";
import { UserException, UserService } from "../../src/server/user";
import type { IGoogleDriveService } from "../../src/server/google-drive";
import { GoogleDriveService } from "../../src/server/google-drive";
import type { AbstractException } from "../../src/server/utils/exception";

const handler: NextApiHandler = async (
  req,
  response,
  userService: IUserService = new UserService(),
  googleDriveService: IGoogleDriveService = new GoogleDriveService(),
) => {
  const session = getSession(req, response);

  if (!session) {
    return response.status(401).json("unauthorized");
  }

  return userService
    .get(session.user.sub)
    .then(({ googleProvider, id }) => {
      if (!googleProvider) {
        throw new UserException("provider not found", 404);
      }

      return {
        provider: googleProvider,
        userId: id,
      };
    })
    .then(({ provider, userId }) =>
      googleDriveService.createFile("test.txt", "text/plain", "Hello world", userId, provider),
    )
    .then(({ status, data }) => {
      console.log(data);

      response.status(status).json(data);
    })
    .catch((error: AbstractException) => {
      console.error(error);

      return response.status(error.code).json(error.errorParsed);
    });
};

export default withApiAuthRequired(handler);
