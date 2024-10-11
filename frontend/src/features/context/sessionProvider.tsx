"use client";
// import { getSession } from "@/app/actions";
import React, { createContext, ReactNode, useContext, useEffect } from "react";
import { auth } from "../../../auth";
interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
  } | null;
  expires: string | null;
}
const SessionContext = createContext<Session | null>(null);
export const useSession = () => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return context;
};

const SessionProvider = async ({ children }: { children: React.ReactNode }) => {
  let session = null;
  const getSession = async () => {
    session = (await auth()) as Session;
  };
  useEffect(() => {
    getSession();
  }, []);
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
