import React, { ReactNode } from 'react';

export const UserContext = React.createContext(6373);

type Props = {
  children: ReactNode;
};

export const UserProvider: React.FC<Props> = ({ children }) => (
  <UserContext.Provider value={6373}>
    {children}
  </UserContext.Provider>
);
