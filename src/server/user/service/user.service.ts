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

  async getAuthorizationHeader(): Promise<string> {
    const { authUrl, apiUrl, clientSecret, clientId } = this._config;

    const { token_type, access_token } = await fetch(authUrl, {
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

    return `${token_type} ${access_token}`;
  }

  async load(userId: string): Promise<void> {
    const { apiUrl } = this._config;
    const authorization = await this.getAuthorizationHeader();

    const dto = await fetch(new URL(`${apiUrl}users/${userId}`).toString(), {
      method: "GET",
      headers: { authorization },
    }).then<IUserGetResponseDto>(async (res) => {
      const data = await res.json();

      if (this.isAuth0ApiErrorResponse(data)) {
        throw new UserException(data, res.status);
      }

      return data;
    });

    this._user = UserModelFactory.fromGetResponseDto(dto);
  }

  async saveMetaData(data: IUserMetadataDto): Promise<void> {
    const { apiUrl } = this._config;
    const authorization = await this.getAuthorizationHeader();

    const dto = await fetch(new URL(apiUrl + "users/" + this._user.id).toString(), {
      method: "PATCH",
      headers: {
        authorization,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        user_metadata: data,
      }),
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
