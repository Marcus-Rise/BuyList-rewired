import { AbstractException } from "../../utils/exception";

class UserException extends AbstractException {
  constructor(public code: number, error: unknown) {
    super(UserException.name, error);
  }
}

export { UserException };
