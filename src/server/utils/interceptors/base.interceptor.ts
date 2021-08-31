import type { IHandler } from "./interceptor";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { withErrorHandle } from "./error-handle.interceptor";
import { container } from "../../ioc";
import type { NextApiHandler } from "next";

const withBaseInterceptor = (contructor: new (...args: any[]) => IHandler) => {
  const handler = container.resolve(contructor);

  const handle: NextApiHandler = (req, res) => handler.handle(req, res);

  return withApiAuthRequired(withErrorHandle(handle));
};

export { withBaseInterceptor };
