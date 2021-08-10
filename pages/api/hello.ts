import type { NextApiHandler } from "next";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { IUserService } from "../../src/server/user";
import { UserException, UserService } from "../../src/server/user";
import type { GoogleDriveException, IGoogleDriveService } from "../../src/server/google-drive";
import { GoogleDriveService } from "../../src/server/google-drive";

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
        throw new UserException(500, "google identifier not found");
      } else {
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
        )
        .then(({ status, data }) => response.status(status).json(data))
        .catch(({ errorParsed, code }: GoogleDriveException) =>
          response.status(code).json(errorParsed),
        ),
    )
    .catch(({ code, errorParsed }: UserException) => response.status(code).json(errorParsed));
};

export default withApiAuthRequired(handler);
