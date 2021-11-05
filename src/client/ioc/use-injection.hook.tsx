import type { FC } from "react";
import { createContext, useContext, useMemo } from "react";
import type { Container, interfaces } from "inversify";

const InjectionContext = createContext<{ container: Container | null }>({ container: null });

const InjectionProvider: FC<{ container: Container }> = ({ container, children }) => (
  <InjectionContext.Provider value={{ container }}>{children}</InjectionContext.Provider>
);

const useInjection = <T extends unknown>(identifier: interfaces.ServiceIdentifier<T>): T => {
  const { container } = useContext(InjectionContext);

  if (!container) {
    throw new Error("No ioc container provided");
  }

  return useMemo(() => container.get<T>(identifier), [container, identifier]);
};

export { InjectionProvider, useInjection };
