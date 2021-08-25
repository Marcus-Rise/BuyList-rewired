import { UserProviderModel } from "./user-provider.model";
import type { IUserProviderGetResponseDto } from "../dto";

class UserProviderModelFactory {
  static fromGetResponseDto(dto: IUserProviderGetResponseDto): UserProviderModel {
    return new UserProviderModel(dto.provider, dto.access_token, dto.refresh_token);
  }
}

export { UserProviderModelFactory };
