import type { AppProps } from "next/app";
import { UserProvider } from "@auth0/nextjs-auth0";
import type { FC } from "react";

const MyApp: FC<AppProps> = ({ Component, pageProps: { user, ...pageProps } }) => (
  <UserProvider user={user}>
    <Component {...pageProps} />
  </UserProvider>
);

export default MyApp;
