import React, { createContext, useContext } from 'react';

interface AppMenuContextValue {
  onLogout: () => void;
}

const AppMenuContext = createContext<AppMenuContextValue | null>(null);

interface AppMenuProviderProps {
  children: React.ReactNode;
  onLogout: () => void;
}

export function AppMenuProvider({ children, onLogout }: AppMenuProviderProps) {
  return (
    <AppMenuContext.Provider value={{ onLogout }}>
      {children}
    </AppMenuContext.Provider>
  );
}

export function useAppMenu() {
  return useContext(AppMenuContext);
}