import { UserModel, UserModelFactory } from "../model";
import type { IUserService } from "./user.service.interface";
import type { IUserGetResponseDto, IUserMetadataDto } from "../dto";
import { UserException } from "./user.exception";
import type { IUserConfig } from "../config";

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
  constructor(private readonly _config: IUserConfig) {}

  private _user: UserModel = new UserModel();

  get user(): UserModel {
    return this._user;
  }

  isAuth0ApiErrorResponse(
    res: Record<string, unknown> | IAuth0ApiErrorResponse,
  ): res is IAuth0ApiErrorResponse {
    return "error" in res && "error_description" in res;
  }

  async getToken(): Promise<IAuth0ApiTokenResponse> {
    const { authUrl, apiUrl, clientSecret, clientId } = this._config;

    return fetch(authUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
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

  async load(userId: string): Promise<void> {
    const { apiUrl } = this._config;
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

    this._user = UserModelFactory.fromGetResponseDto(dto);
  }
}

export { UserService };
