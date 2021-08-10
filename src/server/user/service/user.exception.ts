import { AbstractException } from "../../utils/exception";

class UserException extends AbstractException {
  constructor(error: unknown, code?: number) {
    super(UserException.name, code, error);
  }
}

export { UserException };
