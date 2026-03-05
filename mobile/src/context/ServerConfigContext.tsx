import React, { createContext, useContext } from 'react';

type ServerConfigContextValue = {
  showConfigAgain: () => void;
};

const ServerConfigContext = createContext<ServerConfigContextValue | null>(null);

export function ServerConfigProvider({
  children,
  showConfigAgain
}: {
  children: React.ReactNode;
  showConfigAgain: () => void;
}) {
  return (
    <ServerConfigContext.Provider value={{ showConfigAgain }}>
      {children}
    </ServerConfigContext.Provider>
  );
}

export function useShowConfigAgain(): (() => void) | null {
  const ctx = useContext(ServerConfigContext);
  return ctx?.showConfigAgain ?? null;
}
