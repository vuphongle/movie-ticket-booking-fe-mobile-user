import { createContext, useState, ReactNode, useMemo } from "react";

import { LoadingOverlay } from "@Components/LoadingOverlay";

export const LoadingContext = createContext({
  isLoading: false,
  setLoading: (_loading: boolean) => {},
});

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setLoading] = useState(false);

  const contextValue = useMemo(() => ({ isLoading, setLoading }), [isLoading]);

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
      <LoadingOverlay visible={isLoading} />
    </LoadingContext.Provider>
  );
}
