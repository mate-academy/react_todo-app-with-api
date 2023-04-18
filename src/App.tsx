/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';

import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer';

import { getFilteredTodos } from './helpers/helpers';
import { FilterType } from './types/FilterType';
import { ErrorType } from './types/ErrorType';
import { ErrorMessage } from './components/ErrorMessage';
import { Loader } from './components/Loader';

const USER_ID = 6928;

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorType>(ErrorType.NONE);
  const [filterType, setFilterType] = useState(FilterType.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodosId, setLoadingTodosId] = useState<Set<number>>(new Set());

  const showError = (errorName: ErrorType) => {
    setErrorMessage(errorName);

    setTimeout(() => {
      setErrorMessage(ErrorType.NONE);
    }, 3000);
  };

  const handleClosingError = () => {
    setErrorMessage(ErrorType.NONE);
  };

  const visibleTodos = useMemo(() => {
    return getFilteredTodos(todos, filterType);
  }, [todos, filterType]);

  const activeTodos = useMemo(() => {
    return getFilteredTodos(todos, FilterType.Active);
  }, [todos]);

  const completedTodos = useMemo(() => {
    return getFilteredTodos(todos, FilterType.Completed);
  }, [todos]);

  const addToLoadingTodos = useCallback((id: number) => {
    setLoadingTodosId(state => {
      state.add(id);

      return new Set(state);
    });
  }, []);

  const removeFromLoadingTodos = useCallback((id: number) => {
    setLoadingTodosId(state => {
      state.delete(id);

      return new Set(state);
    });
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        const todosFromServer = await getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch {
        showError(ErrorType.LOAD);
      }

      setIsLoading(false);
    };

    loadData();
  }, []);

  const addNewTodo = async (title: string) => {
    if (!title.trim()) {
      showError(ErrorType.TITLE);

      return;
    }

    const newTodo = {
      title,
      userId: USER_ID,
      completed: false,
    };

    try {
      setTempTodo({
        ...newTodo,
        id: 0,
      });

      addToLoadingTodos(0);

      const currNewTodo = await addTodo(USER_ID, newTodo);

      setTodos(prevTodos => [...prevTodos, currNewTodo]);
    } catch {
      showError(ErrorType.ADD);
    }

    setTempTodo(null);
  };

  const removeTodo = async (todoId: number) => {
    try {
      addToLoadingTodos(todoId);

      await deleteTodo(todoId);

      setTodos(prevTodos => (
        prevTodos.filter(({ id }) => id !== todoId)
      ));
    } catch {
      showError(ErrorType.DELETE);
    }

    setErrorMessage(ErrorType.NONE);
  };

  const handleUpdateTodo = async (id: number, data: Partial<Todo>) => {
    addToLoadingTodos(id);

    try {
      const updatedTodo = await updateTodo(id, data);

      setTodos((prevTodos) => prevTodos.map((prevTodo) => {
        if (prevTodo.id === updatedTodo.id) {
          return {
            ...prevTodo,
            ...updatedTodo,
          };
        }

        return prevTodo;
      }));
    } catch {
      showError(ErrorType.UPDATE);
    }

    removeFromLoadingTodos(id);
  };

  const handleUpdatingAll = useCallback(() => {
    activeTodos.forEach(({ id }) => {
      handleUpdateTodo(id, { completed: true });
    });

    if (!activeTodos.length) {
      completedTodos.forEach(({ id }) => {
        handleUpdateTodo(id, { completed: false });
      });
    }
  }, [activeTodos, completedTodos]);

  const handleDeleteCompleted = useCallback(() => {
    todos.forEach(({ completed, id }) => {
      if (completed) {
        removeTodo(id);
      }
    });
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAdd={addNewTodo}
          tempTodo={tempTodo}
          activeTodos={activeTodos.length}
          handleUpdatingAll={handleUpdatingAll}
        />

        {isLoading && (
          <Loader />
        )}

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          onDelete={removeTodo}
          loadingTodosId={loadingTodosId}
          onUpdate={handleUpdateTodo}
        />

        {todos.length > 0 && (
          <Footer
            filterType={filterType}
            onFilterChange={setFilterType}
            activeTodos={activeTodos.length}
            onDeleteCompleted={handleDeleteCompleted}
            completedTodos={completedTodos}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        onClose={handleClosingError}
      />
    </div>
  );
};
