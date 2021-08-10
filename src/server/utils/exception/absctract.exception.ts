abstract class AbstractException extends Error {
  public code: number;

  protected constructor(name: string, code = 500, error: unknown) {
    const errorString: string = typeof error === "string" ? error : JSON.stringify(error);
    const message = !!errorString && errorString.length ? errorString : undefined;

    super(message);

    this.name = name;
    this.code = code;
  }

  get errorParsed() {
    let error;

    try {
      error = JSON.parse(this.message);
    } catch {
      error = this.message;
    }

    return typeof error === "string"
      ? {
          name: this.name,
          error,
        }
      : {
          name: this.name,
          ...error,
        };
  }
}

export { AbstractException };
