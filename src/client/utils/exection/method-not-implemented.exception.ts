import { AbstractException } from "./abstract.exception";

class MethodNotImplementedException extends AbstractException {
  constructor(message?: string) {
    super(MethodNotImplementedException.name, message ?? "Method not implemented yet");
  }
}

export { MethodNotImplementedException };
