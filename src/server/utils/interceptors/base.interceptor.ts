import type { NextInterceptor } from "./interceptor";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { withErrorHandle } from "./error-handle.interceptor";
import { withUserStorageInitialization } from "./user-storage-init.interceptor";

const withBaseInterceptor: NextInterceptor = (handler) =>
  withApiAuthRequired(withErrorHandle(withUserStorageInitialization(handler)));

export { withBaseInterceptor };
