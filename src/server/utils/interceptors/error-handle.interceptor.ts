import type { NextInterceptor } from "./interceptor";
import { AbstractException } from "../exception";

const withErrorHandle: NextInterceptor = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (error) {
    console.error(error);

    if (error instanceof AbstractException) {
      return res.status(error.code).json(error.errorParsed);
    } else {
      return res.send(error);
    }
  }
};

export { withErrorHandle };
