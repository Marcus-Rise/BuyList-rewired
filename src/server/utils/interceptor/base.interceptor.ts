import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { withErrorHandle } from "./error-handle.interceptor";
import type { Interceptor } from "./interceptor";
import { withUserJsonStorage } from "../../user/user-json-storage.interceptor";

const withBaseInterceptor: Interceptor = (handler) =>
  withApiAuthRequired(withErrorHandle(withUserJsonStorage(handler)));

export { withBaseInterceptor };
