import React, { useState } from 'react';
import { Todo } from './types/Todo';

interface Props {
  todos: Todo[];
  setTodos: (q: Todo[]) => void;
  title: string;
  setTitle: (q: string) => void;
  tempTodo: Todo | null;
  setTempTodo: (q: Todo | null) => void;
  isInputDisabled: boolean;
  setIsInputDisabled: (q: boolean) => void;
  isLoader: number | null;
  setIsLoader: (q: number | null) => void;
}

export const TodosContext = React.createContext<Props>({
  todos: [],
  setTodos: () => { },
  title: '',
  setTitle: () => { },
  tempTodo: null,
  setTempTodo: () => { },
  isInputDisabled: false,
  setIsInputDisabled: () => { },
  isLoader: null,
  setIsLoader: () => { },
});

interface ProviderProps {
  children: React.ReactNode;
}

export const TodosProvider: React.FC<ProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [isLoader, setIsLoader] = useState<number | null>(null);

  return (
    <TodosContext.Provider
      value={{
        todos,
        setTodos,
        title,
        setTitle,
        tempTodo,
        setTempTodo,
        isInputDisabled,
        setIsInputDisabled,
        isLoader,
        setIsLoader,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
