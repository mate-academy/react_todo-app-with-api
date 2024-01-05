import { createContext, useContext } from 'react';
import { UserWarning } from '../UserWarning';

const AuthContext = createContext<number>(0);

type Props = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children } : Props) => {
  const USER_ID = 12061;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <AuthContext.Provider value={USER_ID}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
