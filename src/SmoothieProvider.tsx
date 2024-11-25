import { createContext, ReactNode, useContext } from "react";
import { useRequest } from "./hooks/Request";
import { localSmoothieStorage } from "./storage/LocalStorage";
import { Smoothie } from "./types/Smoothie";

type SmoothieProviderProps = {
  children: ReactNode;
};

export type SmoothieContextType = {
  smoothies: Smoothie[] | null;
  isLoading: boolean;
  error: string | null;
};

const SmoothieContext = createContext<SmoothieContextType | undefined>(undefined);

export const SmoothieProvider = ({ children }: SmoothieProviderProps) => {
  const smoothiesResponse = useRequest(localSmoothieStorage.readSmoothies);

  const contextValue: SmoothieContextType = {
    smoothies: smoothiesResponse.status === "success" ? smoothiesResponse.data : null,
    isLoading: smoothiesResponse.status === "loading",
    error: smoothiesResponse.status === "error" ? "Failed to fetch smoothies." : null,
  };

  if (contextValue.error) {
    alert("Failed to fetch smoothies from local storage. Data may not be persisted.");
  }

  return (
    <SmoothieContext.Provider value={contextValue}>
      {children}
    </SmoothieContext.Provider>
  );
};

export const useSmoothies = (): SmoothieContextType => {
  const context = useContext(SmoothieContext);
  if (!context) {
    throw new Error("useSmoothies must be used within a SmoothieProvider");
  }
  return context;
};
