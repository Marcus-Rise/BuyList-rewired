import { UserProviderModel } from "./user-provider.model";
import type { IUserProviderGetResponseDto } from "../service/user-get-response.dto";

class UserProviderModelFactory {
  static fromGetResponseDto(dto: IUserProviderGetResponseDto, lastLogin: Date): UserProviderModel {
    return new UserProviderModel(
      dto.provider,
      dto.access_token,
      dto.refresh_token,
      new Date(lastLogin.getTime() + dto.expires_in),
    );
  }
}

export { UserProviderModelFactory };
