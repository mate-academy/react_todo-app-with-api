import React, { ReactNode, useState } from 'react';
import { User } from './types/User';
import { StringValues } from './types/enums';

interface AppContextType {
  user: User | null,
  setUser: (userData: User | null) => void,
}

export const AppContext = React.createContext<AppContextType>({
  user: null,
  setUser: () => {},
});

interface ChildrenType {
  children: ReactNode;
}

const getData = localStorage.getItem(StringValues.user) || null;

const getUserFromLocalStorage = getData ? JSON.parse(getData) : null;

export const AppProvider: React.FC<ChildrenType> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getUserFromLocalStorage);

  const context = {
    user,
    setUser,
  };

  return (
    <AppContext.Provider value={context}>
      {children}
    </AppContext.Provider>
  );
};
