import React, { ReactNode } from 'react';

export const UserContext = React.createContext(6192);

type Props = {
  children: ReactNode;
};

export const UserProvider: React.FC<Props> = ({ children }) => (
  <UserContext.Provider value={6192}>
    {children}
  </UserContext.Provider>
);
