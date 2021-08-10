abstract class AbstractException extends Error {
  protected constructor(name: string, error: unknown) {
    const errorString: string = typeof error === "string" ? error : JSON.stringify(error);
    const message = !!errorString && errorString.length ? errorString : undefined;

    super(message);

    this.name = name;
  }

  get errorParsed() {
    return {
      name: this.name,
      ...JSON.parse(this.message),
    };
  }
}

export { AbstractException };
