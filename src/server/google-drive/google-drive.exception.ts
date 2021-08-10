import { AbstractException } from "../utils/exception";

class GoogleDriveException extends AbstractException {
  constructor(public code = 0, message: unknown) {
    super(GoogleDriveException.name, message);
  }
}

export { GoogleDriveException };
