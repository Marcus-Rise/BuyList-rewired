import type { IUserGetResponseDto } from "../service/user-get-response.dto";
import { UserModel } from "./user.model";
import { UserProviderModelFactory } from "./user-provider.model.factory";

class UserModelFactory {
  static fromGetResponseDto(dto: IUserGetResponseDto): UserModel {
    const lastLogin = new Date(dto.last_login);
    const providers = dto.identities.map((i) =>
      UserProviderModelFactory.fromGetResponseDto(i, lastLogin),
    );

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
