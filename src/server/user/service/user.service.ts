import type { UserModel } from "../model";
import { UserModelFactory } from "../model";
import type { IUserService } from "./user.service.interface";
import type { IUserGetResponseDto } from "./user-get-response.dto";

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

class UserService implements IUserService {
  async get(userId: string): Promise<UserModel> {
    const AUTH0_TENANT = process.env.AUTH0_ISSUER_BASE_URL;
    const AUTH0_API_URL = AUTH0_TENANT + "/api/v2/";
    const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
    const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;

    const getApiTokenUrl = new URL("/oauth/token", AUTH0_TENANT);
    const { token_type, access_token } = await fetch(getApiTokenUrl.toString(), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        client_id: AUTH0_CLIENT_ID,
        client_secret: AUTH0_CLIENT_SECRET,
        audience: AUTH0_API_URL,
        grant_type: "client_credentials",
      }),
    }).then<IAuth0ApiTokenResponse>((res) => res.json());

    const getUrlApiUrl = new URL("users/" + userId, AUTH0_API_URL);
    const userDto = await fetch(getUrlApiUrl.toString(), {
      method: "GET",
      headers: { Authorization: `${token_type} ${access_token}` },
    }).then<IAuth0ApiErrorResponse | IUserGetResponseDto>((res) => res.json());

    if (isAuth0ApiErrorResponse(userDto)) {
      throw new Auth0ApiError(userDto);
    }

    return UserModelFactory.fromGetResponseDto(userDto);
  }
}

export { UserService };
