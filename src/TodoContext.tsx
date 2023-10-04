import React, { useMemo, useState } from 'react';
import { Todo } from './types/Todo';

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
}

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
  }), [todos, errorMessage, newTitle, selectedId, isEditing, updatedTitle]);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
