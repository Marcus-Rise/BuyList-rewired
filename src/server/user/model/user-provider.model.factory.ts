import { UserProviderModel } from "./user-provider.model";
import type { IUserProviderGetResponseDto } from "../service/user-get-response.dto";

class UserProviderModelFactory {
  static fromGetResponseDto(dto: IUserProviderGetResponseDto): UserProviderModel {
    return new UserProviderModel(dto.provider, dto.access_token, dto.expires_in);
  }
}

export { UserProviderModelFactory };
