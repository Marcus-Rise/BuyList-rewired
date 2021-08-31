import type { NextApiRequest, NextApiResponse } from "next";

interface IHandler<T = unknown> {
  handle(req: NextApiRequest, res: NextApiResponse<T>): void | Promise<void>;
}

export type { IHandler };
