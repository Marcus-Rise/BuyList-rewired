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
        throw new UserException("google identifier not found", 404);
      } else {
        /* if (googleProvider.isTokenExpired) {
           //todo refresh token
           throw new UserException("google token is expired", 403);
         }*/

        return {
          accessToken: googleProvider.accessToken,
          userId: id,
        };
      }
    })
    .then(({ accessToken, userId }) =>
      googleDriveService
        .checkToken(accessToken)
        .then(() =>
          googleDriveService.createFile(
            "test.txt",
            "text/plain",
            "Hello world",
            userId,
            accessToken,
          ),
        ),
    )
    .then(({ status, data }) => response.status(status).json(data))
    .catch(({ code, errorParsed }: AbstractException) => response.status(code).json(errorParsed));
};

export default withApiAuthRequired(handler);
