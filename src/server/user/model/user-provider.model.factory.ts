import { UserProviderModel } from "./user-provider.model";
import type { IUserProviderDto } from "../repository";

class UserProviderModelFactory {
  static fromGetResponseDto(dto: IUserProviderDto): UserProviderModel {
    return new UserProviderModel(dto.provider, dto.access_token, dto.refresh_token);
  }
}

export { UserProviderModelFactory };
