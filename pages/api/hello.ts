// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiHandler, NextApiResponse } from "next";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { OAuth2Client } from "google-auth-library";
import type { IUserService } from "../../src/server/user";
import { UserService } from "../../src/server/user";

const googleErrorHandle = (e: any, res: NextApiResponse) => {
  const { code, errors } = e?.response?.data?.error;

  return res.status(code ?? 500).json(errors ?? e);
};

const handler: NextApiHandler = async (
  req,
  response,
  userService: IUserService = new UserService(),
) => {
  const session = await getSession(req, response);

  if (!session) {
    return response.status(401).json("unauthorized");
  }

  const { googleProvider } = await userService.get(session.user.sub);

  if (!googleProvider) {
    return response.status(404).json("google identifier not found");
  }

  const { accessToken } = googleProvider;

  // res.status(200).json(googleIdentifier);

  const oAuth2Client = new OAuth2Client();
  /*const tokenInfo = */
  await oAuth2Client.getTokenInfo(accessToken ?? "").catch((e) => googleErrorHandle(e, response));

  // if (tokenInfo) {
  //   return response.status(200).json(tokenInfo);
  // }
  //
  // oAuth2Client.setCredentials({
  //   access_token: googleAccessToken,
  // });
  //
  // const drive = google.drive({ version: "v3" });
  //
  // await drive.files
  //   .create({
  //     requestBody: {
  //       name: "test.txt",
  //     },
  //     media: {
  //       mimeType: "text/plain",
  //       body: "Hello World",
  //     },
  //   })
  //   .then(({ status, data }) => res.status(status).json(data))
  //   .catch((e) => googleErrorHandle(e, res));

  const GOOGLE_DRIVE_API_URL = "https://www.googleapis.com/upload/drive/v3";
  const url = new URL("/files", GOOGLE_DRIVE_API_URL);
  url.searchParams.set("uploadType", "media");
  const result = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ id: "test_buy_list", name: "test.txt", mimeType: "text/plain" }),
  })
    .then(async (res) => {
      const data = await res.json();

      return { data, status: res.status };
    })
    .catch((e) => {
      return response.status(500).json(e);
    });

  if (result) {
    const { data, status } = result;

    return response.status(status).json(data);
  }
};

export default withApiAuthRequired(handler);
