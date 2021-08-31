import type { NextApiHandler } from "next";

type Interceptor = (handler: NextApiHandler) => NextApiHandler;

export type { Interceptor };
