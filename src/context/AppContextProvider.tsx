import {
  FC, useState, useEffect, MouseEvent, useMemo,
} from 'react';
import { getTodos } from '../api/todos';
import { Todo, Filter } from '../types';
import { AppContext } from './AppContext';

type Props = React.PropsWithChildren;

export const AppContextProvider: FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<Filter>(Filter.all);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosBeingLoaded, setTodosBeingLoaded] = useState<number[]>([]);

  const handleFilterChange = (event: MouseEvent<HTMLAnchorElement>) => {
    const { id } = event.target as HTMLAnchorElement;

    if (selectedFilter === id) {
      return;
    }

    setSelectedFilter(id as Filter);
  };

  const activeTodosNum = todos.reduce((acc, curr) => {
    return !curr.completed
      ? acc + 1
      : acc;
  }, 0);

  const completedTodosNum = todos.length - activeTodosNum;

  const loadData = async () => {
    try {
      const response = await getTodos();

      setTodos(response);
    } catch (error) {
      setErrorMessage('Unable to load todos');
      setShowError(true);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (showError) {
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  }, [showError]);

  const visibleTodos = useMemo(() => {
    let updatedTodos = [...todos];

    if (todos.length) {
      switch (selectedFilter) {
        case Filter.active:
          updatedTodos = updatedTodos.filter(todo => !todo.completed) || [];
          break;
        case Filter.completed:
          updatedTodos = updatedTodos.filter(todo => todo.completed) || [];
          break;
        default:
          break;
      }
    }

    return updatedTodos;
  }, [selectedFilter, todos]);

  const appContextValue = {
    todos,
    setTodos,
    selectedFilter,
    setSelectedFilter,
    showError,
    setShowError,
    errorMessage,
    setErrorMessage,
    visibleTodos,
    handleFilterChange,
    loadData,
    tempTodo,
    setTempTodo,
    todosBeingLoaded,
    setTodosBeingLoaded,
    completedTodosNum,
    activeTodosNum,
  };

  return (
    <AppContext.Provider value={appContextValue}>
      {children}
    </AppContext.Provider>
  );
};
