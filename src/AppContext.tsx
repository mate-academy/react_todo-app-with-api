import React, { ReactNode, useState } from 'react';
import { User } from './types/User';

interface AppContextType {
  user: User | 0,
  setUser: (userData: User | 0) => void,
}

export const AppContext = React.createContext<AppContextType>({
  user: 0,
  setUser: () => {},
});

interface ChildrenType {
  children: ReactNode;
}

function isJson(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }

  return true;
}

const getData = localStorage.getItem('user') || '0';

const getUserFromLocalStorage = JSON.parse(isJson(getData) ? getData : '0');

export const AppProvider: React.FC<ChildrenType> = ({ children }) => {
  const [user, setUser] = useState<User | 0>(getUserFromLocalStorage);

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
