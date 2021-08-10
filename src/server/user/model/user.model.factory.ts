import type { IUserGetResponseDto } from "../service/user-get-response.dto";
import { UserModel, UserProviderModel } from "./user.model";

class UserModelFactory {
  static fromGetResponseDto(dto: IUserGetResponseDto): UserModel {
    const providers = dto.identities.map(
      (i) => new UserProviderModel(i.provider, i.access_token, i.expires_in),
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
