import type { UserModel } from "../model";
import { UserModelFactory } from "../model";
import type { IUserService } from "./user.service.interface";
import type { IUserGetResponseDto } from "./user-get-response.dto";
import { UserException } from "./user.exception";

interface IAuth0ApiTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface IAuth0ApiErrorResponse {
  error: string;
  error_description: string;
}

const isAuth0ApiErrorResponse = (
  res: Record<string, unknown> | IAuth0ApiErrorResponse,
): res is IAuth0ApiErrorResponse => {
  return "error" in res && "error_description" in res;
};

class UserService implements IUserService {
  async get(userId: string): Promise<UserModel> {
    const AUTH0_TENANT = process.env.AUTH0_ISSUER_BASE_URL;
    const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
    const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;
    const apiUrl = new URL("/api/v2/", AUTH0_TENANT);

    const { token_type, access_token } = await fetch(
      new URL("/oauth/token", AUTH0_TENANT).toString(),
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          client_id: AUTH0_CLIENT_ID,
          client_secret: AUTH0_CLIENT_SECRET,
          audience: apiUrl,
          grant_type: "client_credentials",
        }),
      },
    ).then<IAuth0ApiTokenResponse>(async (res) => {
      const data = await res.json();

      if (isAuth0ApiErrorResponse(data)) {
        throw new UserException(res.status, data);
      }

      return data;
    });

    const dto = await fetch(new URL(`${apiUrl}users/${userId}`).toString(), {
      method: "GET",
      headers: { Authorization: `${token_type} ${access_token}` },
    }).then<IUserGetResponseDto>(async (res) => {
      const data = await res.json();

      if (isAuth0ApiErrorResponse(data)) {
        throw new UserException(res.status, data);
      }

      return data;
    });

    return UserModelFactory.fromGetResponseDto(dto);
  }
}

export { UserService };
