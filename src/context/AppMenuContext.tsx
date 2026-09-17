import React, { createContext, useContext } from 'react';

interface AppMenuContextValue {
  onLogout: () => void;
  onChangePassword: () => void;
}

const AppMenuContext = createContext<AppMenuContextValue | null>(null);

interface AppMenuProviderProps {
  children: React.ReactNode;
  onLogout: () => void;
  onChangePassword: () => void;
}

export function AppMenuProvider({ children, onLogout, onChangePassword }: AppMenuProviderProps) {
  return (
    <AppMenuContext.Provider value={{ onLogout, onChangePassword }}>
      {children}
    </AppMenuContext.Provider>
  );
}

export function useAppMenu() {
  return useContext(AppMenuContext);
}