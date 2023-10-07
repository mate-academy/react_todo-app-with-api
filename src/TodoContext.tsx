import React, { useMemo, useState } from 'react';
import { Todo } from './types/Todo';
import { useLocalStorage } from './hooks/UseLocalStorege';
import { User } from './types/User';

interface ITodosContext {
  todos: Todo[],
  setTodos: (newTodos: Todo[]) => void,
  errorMessage: string,
  setErrorMessage: (newMessage: string) => void,
  newTitle: string,
  setNewTitle: (newTitle: string) => void,
  selectedId: number[] | null,
  setSelectedId: (arrOfIds: number[] | null) => void,
  isEditing: boolean,
  setIsEditing: (status: boolean) => void,
  updatedTitle: string,
  setUpdatedTitle: (newTitle: string) => void,
  isLoading: boolean,
  setIsLoading: (status: boolean) => void,
  user: User,
  setUser: (user: User) => void,
}

const defaultUser: User = {
  id: 0,
  name: 'dafaultName',
  username: 'defaultUserName',
  email: 'defaultEmail',
  phone: 'dafaultPhone',
};
// const defaultUser: User = {
//   createdAt: '',
//   email: '',
//   id: 0,
//   name: '',
//   phone: null,
//   updatedAt: '',
//   username: null,
//   website: null,
// };

export const TodosContext = React.createContext<ITodosContext>({
  todos: [],
  setTodos: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  newTitle: '',
  setNewTitle: () => {},
  selectedId: null,
  setSelectedId: () => {},
  isEditing: false,
  setIsEditing: () => {},
  updatedTitle: '',
  setUpdatedTitle: () => {},
  isLoading: false,
  setIsLoading: () => {},
  user: defaultUser,
  setUser: () => {},
});

export const useTodos = (): ITodosContext => React.useContext(TodosContext);

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [selectedId, setSelectedId] = useState<number[] | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useLocalStorage<User>('user', defaultUser);

  const value = useMemo(() => ({
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    newTitle,
    setNewTitle,
    selectedId,
    setSelectedId,
    isEditing,
    setIsEditing,
    updatedTitle,
    setUpdatedTitle,
    isLoading,
    setIsLoading,
    user,
    setUser,
  }), [
    todos,
    errorMessage,
    newTitle,
    selectedId,
    isEditing,
    updatedTitle,
    isLoading,
    user,
  ]);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
