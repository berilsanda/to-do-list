import React, { createContext } from "react";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  // current user handler
  const [user, setUser] = React.useState({});
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default () => React.useContext(UserContext);
