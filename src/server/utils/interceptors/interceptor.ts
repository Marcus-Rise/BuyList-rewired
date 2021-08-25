import type { NextApiHandler } from "next";

type NextInterceptor = (handler: NextApiHandler) => NextApiHandler;

export type { NextInterceptor };
