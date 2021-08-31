import { container } from "../../ioc";
import type { NextApiHandler } from "next";
import type { IHandler } from "./handler";

const nextHandlerFactory = (constructor: new (...args: any[]) => IHandler): NextApiHandler => {
  const handler = container.resolve(constructor);

  return (req, res) => handler.handle(req, res);
};

export { nextHandlerFactory };
