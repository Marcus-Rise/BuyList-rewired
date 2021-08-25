import type { IUserGetResponseDto } from "../dto";
import { UserModel } from "./user.model";
import { UserProviderModelFactory } from "./user-provider.model.factory";

class UserModelFactory {
  static fromGetResponseDto(dto: IUserGetResponseDto): UserModel {
    const providers = dto.identities.map((i) => UserProviderModelFactory.fromGetResponseDto(i));

    return new UserModel(
      dto.user_id,
      dto.email,
      dto.given_name,
      dto.family_name,
      dto.picture,
      providers,
    );
  }
}

export { UserModelFactory };
