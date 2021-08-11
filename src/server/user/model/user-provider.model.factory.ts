import { UserProviderModel } from "./user-provider.model";
import type { IUserProviderGetResponseDto } from "../service/user-get-response.dto";
import { UserException } from "../service";

class UserProviderModelFactory {
  static fromGetResponseDto(dto: IUserProviderGetResponseDto): UserProviderModel {
    if (!dto.refresh_token) {
      throw new UserException("no provider refresh token", 400);
    }

    return new UserProviderModel(dto.provider, dto.access_token, dto.refresh_token, dto.expires_in);
  }
}

export { UserProviderModelFactory };
