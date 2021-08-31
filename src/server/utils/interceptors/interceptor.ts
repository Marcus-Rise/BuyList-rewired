import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

interface IHandler<T = unknown> {
  handle(req: NextApiRequest, res: NextApiResponse<T>): void | Promise<void>;
}

type Interceptor = (handler: NextApiHandler) => NextApiHandler;

export type { IHandler, Interceptor };
