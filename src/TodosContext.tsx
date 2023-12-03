import React, { useMemo, useState } from 'react';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorNotification } from './types/ErrorNotification';

interface Props {
  todos: Todo[];
  setTodos: (q: Todo[]) => void;
  filter: Filter;
  setFilter: (q: Filter) => void;
  errorMessage: ErrorNotification;
  setErrorMessage: (q: ErrorNotification) => void;
  title: string;
  setTitle: (q: string) => void;
  tempTodo: Todo | null;
  setTempTodo: (q: Todo | null) => void;
  isInputDisabled: boolean;
  setIsInputDisabled: (q: boolean) => void;
  isLoader: number | null;
  setIsLoader: (q: number | null) => void;
  filteredTodos: Todo[];
}

export const TodosContext = React.createContext<Props>({
  todos: [],
  setTodos: () => { },
  filter: Filter.All,
  setFilter: () => { },
  errorMessage: ErrorNotification.Default,
  setErrorMessage: () => { },
  title: '',
  setTitle: () => { },
  tempTodo: null,
  setTempTodo: () => { },
  isInputDisabled: false,
  setIsInputDisabled: () => { },
  isLoader: null,
  setIsLoader: () => { },
  filteredTodos: [],
});

interface ProviderProps {
  children: React.ReactNode;
}

export const TodosProvider: React.FC<ProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage]
    = useState<ErrorNotification>(ErrorNotification.Default);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [isLoader, setIsLoader] = useState<number | null>(null);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  return (
    <TodosContext.Provider
      value={{
        todos,
        setTodos,
        filter,
        setFilter,
        errorMessage,
        setErrorMessage,
        title,
        setTitle,
        tempTodo,
        setTempTodo,
        isInputDisabled,
        setIsInputDisabled,
        isLoader,
        setIsLoader,
        filteredTodos,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
