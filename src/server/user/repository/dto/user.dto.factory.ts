import type { UserModel } from "../../model";
import { UserDto } from "./user.dto";

class UserDtoFactory {
  static fromModel(model: UserModel): UserDto {
    const dto = new UserDto();

    dto.user_metadata = {
      json_storage: model.jsonStorageId,
    };

    return dto;
  }
}

export { UserDtoFactory };
