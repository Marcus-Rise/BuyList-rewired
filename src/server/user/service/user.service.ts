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

class UserService implements IUserService {
  constructor(
    private readonly _tenant = process.env.AUTH0_ISSUER_BASE_URL,
    private readonly _clientId = process.env.AUTH0_CLIENT_ID,
    private readonly _clientSecret = process.env.AUTH0_CLIENT_SECRET,
  ) {}

  isAuth0ApiErrorResponse(
    res: Record<string, unknown> | IAuth0ApiErrorResponse,
  ): res is IAuth0ApiErrorResponse {
    return "error" in res && "error_description" in res;
  }

  async getToken(): Promise<IAuth0ApiTokenResponse> {
    const apiUrl = new URL("/api/v2/", this._tenant);

    return fetch(new URL("/oauth/token", this._tenant).toString(), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        client_id: this._clientId,
        client_secret: this._clientSecret,
        audience: apiUrl,
        grant_type: "client_credentials",
      }),
    }).then<IAuth0ApiTokenResponse>(async (res) => {
      const data = await res.json();

      if (this.isAuth0ApiErrorResponse(data)) {
        throw new UserException(data, res.status);
      }

      return data;
    });
  }

  async get(userId: string): Promise<UserModel> {
    const apiUrl = new URL("/api/v2/", this._tenant);

    const { token_type, access_token } = await this.getToken();

    const dto = await fetch(new URL(`${apiUrl}users/${userId}`).toString(), {
      method: "GET",
      headers: { Authorization: `${token_type} ${access_token}` },
    }).then<IUserGetResponseDto>(async (res) => {
      const data = await res.json();

      if (this.isAuth0ApiErrorResponse(data)) {
        throw new UserException(data, res.status);
      }

      return data;
    });

    return UserModelFactory.fromGetResponseDto(dto);
  }
}

export { UserService };
