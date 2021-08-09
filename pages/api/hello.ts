// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiHandler, NextApiResponse } from "next";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { OAuth2Client } from "google-auth-library";

const googleErrorHandle = (e: any, res: NextApiResponse) => {
  const { code, errors } = e?.response?.data?.error;

  return res.status(code ?? 500).json(errors ?? e);
};

interface IAuth0ApiTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface IAuth0ApiErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

const isAuth0ApiErrorResponse = (
  res: unknown | IAuth0ApiErrorResponse,
): res is IAuth0ApiErrorResponse => {
  return (
    typeof res === "object" &&
    res !== null &&
    "error" in res &&
    "message" in res &&
    "statusCode" in res
  );
};

class Auth0ApiError extends Error {
  code: number;
  title: string;

  constructor({ statusCode, message, error }: IAuth0ApiErrorResponse) {
    super(message);
    this.code = statusCode;
    this.title = error;
  }
}

interface IAuth0ApiUserIdentityProvider {
  provider: string;
  user_id: string;
  connection: string;
  isSocial: boolean;
  access_token: string;
  expires_in: number;
}

interface IAuth0ApiUserResponse {
  created_at: string;
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  identities: Array<IAuth0ApiUserIdentityProvider>;
  locale: string;
  name: string;
  nickname: string;
  picture: string;
  updated_at: string;
  user_id: string;
  last_ip: string;
  last_login: string;
  logins_count: number;
}

const handler: NextApiHandler = async (req, response) => {
  const session = await getSession(req, response);

  if (!session) {
    return response.status(401).json("unauthorized");
  }

  const { user } = session;

  const AUTH0_TENANT = process.env.AUTH0_ISSUER_BASE_URL;
  const AUTH0_API_URL = AUTH0_TENANT + "/api/v2/";
  const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
  const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;

  const AUTH0_API_GET_TOKEN_REQUEST_URL = new URL("/oauth/token", AUTH0_TENANT);
  const { token_type, access_token } = await fetch(AUTH0_API_GET_TOKEN_REQUEST_URL.toString(), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      client_id: AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_SECRET,
      audience: AUTH0_API_URL,
      grant_type: "client_credentials",
    }),
  }).then<IAuth0ApiTokenResponse>((res) => res.json());

  const USER_INFO_REQUEST_URL = new URL("users/" + user.sub, AUTH0_API_URL);
  const userData = await fetch(USER_INFO_REQUEST_URL.toString(), {
    method: "GET",
    headers: { Authorization: `${token_type} ${access_token}` },
  }).then<IAuth0ApiErrorResponse | IAuth0ApiUserResponse>((res) => res.json());

  if (isAuth0ApiErrorResponse(userData)) {
    const { code, ...error } = new Auth0ApiError(userData);

    return response.status(code).json(error);
  }

  const googleIdentifier = userData.identities.find(({ provider }) => provider === "google-oauth2");

  if (!googleIdentifier) {
    return response.status(404).json("google identifier not found");
  }

  const googleAccessToken = googleIdentifier.access_token;

  // res.status(200).json(googleIdentifier);

  const oAuth2Client = new OAuth2Client();
  /*const tokenInfo = */
  await oAuth2Client
    .getTokenInfo(googleAccessToken ?? "")
    .catch((e) => googleErrorHandle(e, response));

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
      Authorization: `Bearer ${googleAccessToken}`,
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
