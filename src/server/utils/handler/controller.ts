import type { NextApiRequest, NextApiResponse } from "next";

interface IController {
  handle(req: NextApiRequest, res: NextApiResponse): void | Promise<void>;
}

export type { IController };
