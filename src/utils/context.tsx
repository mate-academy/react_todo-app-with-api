import React, { ReactNode } from 'react';

export const UserIdContext = React.createContext(10392);

type Props = {
  children: ReactNode;
};

export const UserIdProvider: React.FC<Props> = ({ children }) => {
  return (
    <UserIdContext.Provider value={10392}>
      {children}
    </UserIdContext.Provider>
  );
};
