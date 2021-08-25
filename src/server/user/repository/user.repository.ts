import type { IUserRepository, IUserRepositoryQuery } from "./user.repository.interface";
import type { UserModel } from "../model";
import { UserModelFactory } from "../model";
import type { IUserConfig } from "../config";
import { UserException } from "../service";
import type { IUserDto } from "./dto";
import { UserDtoFactory } from "./dto";

interface IAuth0ApiTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface IAuth0ApiErrorResponse {
  error: string;
  error_description: string;
}

class UserRepository implements IUserRepository {
  constructor(private readonly _config: IUserConfig) {}

  static isAuth0ApiErrorResponse(
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

      if (UserRepository.isAuth0ApiErrorResponse(data)) {
        throw new UserException(data, res.status);
      }

      return data;
    });

    return `${token_type} ${access_token}`;
  }

  async find(query?: Partial<IUserRepositoryQuery>): Promise<UserModel | null> {
    const { apiUrl } = this._config;
    const authorization = await this.getAuthorizationHeader();

    const dto = await fetch(new URL(`${apiUrl}users/${query?.id}`).toString(), {
      method: "GET",
      headers: { authorization },
    }).then<IUserDto>(async (res) => {
      const data = await res.json();

      if (UserRepository.isAuth0ApiErrorResponse(data)) {
        throw new UserException(data, res.status);
      }

      return data;
    });

    return UserModelFactory.fromGetResponseDto(dto);
  }

  list(query?: Partial<IUserRepositoryQuery>): Promise<UserModel[]> {
    return Promise.resolve([]);
  }

  remove(domain: UserModel): Promise<void> {
    return Promise.resolve(undefined);
  }

  async save(domain: UserModel): Promise<UserModel> {
    const { apiUrl } = this._config;
    const authorization = await this.getAuthorizationHeader();

    const dto = await fetch(new URL(apiUrl + "users/" + domain.id).toString(), {
      method: "PATCH",
      headers: {
        authorization,
        "content-type": "application/json",
      },
      body: JSON.stringify(UserDtoFactory.fromModel(domain)),
    }).then<IUserDto>(async (res) => {
      const data = await res.json();

      if (UserRepository.isAuth0ApiErrorResponse(data)) {
        throw new UserException(data, res.status);
      }

      return data;
    });

    return UserModelFactory.fromGetResponseDto(dto);
  }
}

export { UserRepository };
