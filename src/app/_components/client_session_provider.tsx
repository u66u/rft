'use client';

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

interface ClientSessionProviderProps {
  children: ReactNode;
}

const ClientSessionProvider = ({ children }: ClientSessionProviderProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default ClientSessionProvider;