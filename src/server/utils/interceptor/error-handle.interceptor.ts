import type { Interceptor } from "./interceptor";
import { AbstractException } from "../exception";

const withErrorHandle: Interceptor = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (error: any) {
    console.error(error);

    if (error instanceof AbstractException) {
      return res.status(error.code).json(error.errorParsed);
    } else {
      return res.status(500).json(error?.message);
    }
  }
};

export { withErrorHandle };
