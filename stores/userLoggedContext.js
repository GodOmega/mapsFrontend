import { createContext } from "react";

import useUserState from "../hooks/useUserState";
export const UserLoggedContext = createContext();

export const UserLoggedContextProvider = ({ children }) => {
  const userInitialState = useUserState();
  return (
    <UserLoggedContext.Provider value={userInitialState}>
      {children}
    </UserLoggedContext.Provider>
  );
};