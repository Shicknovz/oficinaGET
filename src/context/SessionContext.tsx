import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { readStorage, writeStorage } from '../utils/storage';
import { api, type Usuario } from '../utils/api';

const SESSION_STORAGE_KEY = 'autoget:session-state';

interface SessionState {
  loggedIn: boolean;
  hasSeenIntro: boolean;
  token: string | null;
  usuario: Usuario | null;
}

interface SessionContextValue extends SessionState {
  login: (email: string, senha: string) => Promise<void>;
  register: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => void;
  markIntroSeen: () => void;
}

const DEFAULT_SESSION_STATE: SessionState = {
  loggedIn: false,
  hasSeenIntro: false,
  token: null,
  usuario: null,
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionState>(DEFAULT_SESSION_STATE);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const hydrateSession = async () => {
      const storedSession = await readStorage(SESSION_STORAGE_KEY, DEFAULT_SESSION_STATE);
      if (!mounted) {
        return;
      }

      setSession(storedSession);
      setIsHydrated(true);
    };

    void hydrateSession();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    void writeStorage(SESSION_STORAGE_KEY, session);
  }, [isHydrated, session]);

  const login = async (email: string, senha: string) => {
    const result = await api.login(email, senha);
    setSession((current) => ({ ...current, loggedIn: true, hasSeenIntro: true, token: result.token, usuario: result.usuario }));
  };

  const register = async (nome: string, email: string, senha: string) => {
    const result = await api.register(nome, email, senha);
    setSession((current) => ({ ...current, loggedIn: true, hasSeenIntro: true, token: result.token, usuario: result.usuario }));
  };

  const value = useMemo<SessionContextValue>(() => ({
    ...session,
    login,
    register,
    logout: () => setSession((current) => ({ ...current, loggedIn: false, token: null, usuario: null, hasSeenIntro: true })),
    markIntroSeen: () => setSession((current) => ({ ...current, hasSeenIntro: true })),
  }), [session]);

  if (!isHydrated) {
    return null;
  }

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }

  return context;
}
