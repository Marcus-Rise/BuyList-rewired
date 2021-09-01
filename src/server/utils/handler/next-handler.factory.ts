import { container } from "../../ioc";
import type { NextApiHandler } from "next";
import type { IController } from "./controller";

const nextHandlerFactory = (constructor: new (...args: any[]) => IController): NextApiHandler => {
  const controller = container.resolve(constructor);

  return (req, res) => controller.handle(req, res);
};

export { nextHandlerFactory };
