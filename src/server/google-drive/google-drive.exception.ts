import { AbstractException } from "../utils/exception";

class GoogleDriveException extends AbstractException {
  constructor(error: unknown, code?: number) {
    super(GoogleDriveException.name, code, error);
  }
}

export { GoogleDriveException };
