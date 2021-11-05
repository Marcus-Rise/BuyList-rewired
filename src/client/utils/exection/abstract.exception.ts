abstract class AbstractException extends Error {
  protected constructor(name: string, message: string) {
    super(name + ": " + message);
  }
}

export { AbstractException };
