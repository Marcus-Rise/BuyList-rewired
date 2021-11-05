import "reflect-metadata";
import type { AppProps } from "next/app";
import { UserProvider } from "@auth0/nextjs-auth0";
import type { FC } from "react";
import { InjectionProvider } from "../src/client/ioc/use-injection.hook";
import { container } from "../src/client/ioc/container";

const MyApp: FC<AppProps> = ({ Component, pageProps: { user, ...pageProps } }) => (
  <UserProvider user={user}>
    <InjectionProvider container={container}>
      <Component {...pageProps} />
    </InjectionProvider>
  </UserProvider>
);

export default MyApp;
