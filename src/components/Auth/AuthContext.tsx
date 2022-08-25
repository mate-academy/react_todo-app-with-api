import { useState, createContext, ReactNode } from 'react';
import { User } from '../../types/User';
import { AuthForm } from './AuthForm';

export const AuthContext = createContext<User | null>(null);

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
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
