import {
  FC,
  ReactNode,
  memo,
  useMemo,
  useState,
} from 'react';
import { Props as TodosContextProps, TodosContext } from './TodosContext';
import { Todo } from '../types/Todo';

interface Props {
  children: ReactNode;
}

export const TodosContextProvider: FC<Props> = memo(({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>(todos);
  const [filter, setFilter] = useState<string | null>('');
  const [errorMessage, setErrorMessage] = useState<string | null>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [todosLoader, setTodosLoader] = useState<boolean>(false);
  const [formLoader, setFormLoader] = useState<boolean>(false);
  const [isLoadingCompleted, setIsLoadingCompleted] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const value: TodosContextProps = useMemo(() => ({
    todos,
    visibleTodos,
    filter,
    errorMessage,
    isLoading,
    todosLoader,
    isLoadingCompleted,
    formLoader,
    tempTodo,
    setTodos,
    setVisibleTodos,
    setFilter,
    setErrorMessage,
    setIsLoading,
    setTodosLoader,
    setIsLoadingCompleted,
    setFormLoader,
    setTempTodo,
  }), [
    todos,
    visibleTodos,
    filter,
    errorMessage,
    isLoading,
    todosLoader,
    isLoadingCompleted,
    formLoader,
    tempTodo,
    setTodos,
    setVisibleTodos,
    setFilter,
    setErrorMessage,
    setIsLoading,
    setTodosLoader,
    setIsLoadingCompleted,
    setFormLoader,
    setTempTodo,
  ]);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
});
