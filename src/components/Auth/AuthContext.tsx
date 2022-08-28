import React, { useState } from 'react';
import { User } from '../../types/User';
import { AuthForm } from './AuthForm';

export const AuthContext = React.createContext<User | null>(null);

type Props = {
  children: React.ReactNode;
};

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <>
      {user ? (
        <AuthContext.Provider value={user}>
          {children}
        </AuthContext.Provider>
      ) : (
        <AuthForm onLogin={setUser} />
      )}
    </>
  );
};
