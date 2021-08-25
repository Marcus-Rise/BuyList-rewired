import { AbstractException } from "../utils/exception";

class JsonStorageException extends AbstractException {
  constructor(e: unknown, code: number) {
    super(JsonStorageException.name, code, e);
  }
}

export { JsonStorageException };
