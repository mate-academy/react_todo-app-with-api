import React, { ReactNode } from 'react';

export const UserContext = React.createContext(6380);

type Props = {
  children: ReactNode;
};

export const UserProvider: React.FC<Props> = ({ children }) => {
  return (
    <UserContext.Provider value={6380}>
      {children}
    </UserContext.Provider>
  );
};
