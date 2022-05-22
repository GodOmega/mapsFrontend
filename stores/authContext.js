import { createContext } from "react";

import useAuthState from "../hooks/useAuthState";
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const authInitialState = useAuthState();
  return (
    <AuthContext.Provider value={authInitialState}>
      {children}
    </AuthContext.Provider>
  );
};
