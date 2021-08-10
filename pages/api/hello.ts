import type { NextApiHandler } from "next";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { IUserService } from "../../src/server/user";
import { UserService } from "../../src/server/user";
import type { GoogleDriveException, IGoogleDriveService } from "../../src/server/google-drive";
import { GoogleDriveService } from "../../src/server/google-drive";

const handler: NextApiHandler = async (
  req,
  response,
  userService: IUserService = new UserService(),
  googleDriveService: IGoogleDriveService = new GoogleDriveService(),
) => {
  const session = await getSession(req, response);

  if (!session) {
    return response.status(401).json("unauthorized");
  }

  const { googleProvider, ...user } = await userService.get(session.user.sub);

  if (!googleProvider) {
    return response.status(404).json("google identifier not found");
  }

  return googleDriveService
    .checkToken(googleProvider.accessToken)
    .then(() =>
      googleDriveService.createFile(
        "test.txt",
        "text/plain",
        "Hello world",
        user.id,
        googleProvider.accessToken,
      ),
    )
    .then(({ status, data }) => response.status(status).json(data))
    .catch(({ code, message }: GoogleDriveException) => response.status(code).json(message));
};

export default withApiAuthRequired(handler);
