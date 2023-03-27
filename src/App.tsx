/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { UserWarning } from './UserWarning';
import { TodoFilter } from './components/TodoFilter';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header';
import { TodoItem } from './components/TodoItem';
import type { Todo } from './types/Todo';

import { LoadingTodosContext } from './LoadingTodosContext';

import { deleteTodo, getTodos, postTodo } from './api/todos';
import { FilterType } from './enums/FilterType';
import { getFilteredTodos } from './utils/getFilteredTodos';

enum NotificationType {
  Success = 'success',
  Error = 'error',
  Loading = 'Loading',
}

const USER_ID = 6712;

const notify = (message: string, type: NotificationType) => {
  const duration = 3000;
  const position = 'top-center';
  const iconTheme = {
    primary: '#FFA62B',
    secondary: '#0F1108',
  };

  switch (type) {
    case NotificationType.Error:
      toast.error(message, {
        duration,
        position,
        iconTheme,
      });
      break;
    case NotificationType.Success:
      toast.success(message, {
        duration,
        position,
        iconTheme,
      });
      break;
    case NotificationType.Loading:
      toast.loading(message, {
        duration: 500,
        position,
      });
      break;
    default:
      toast(message);
  }
};

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterType, setFilterType] = useState(FilterType.All);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);

  const getCompletedTodos = () => todos.filter(({ completed }) => completed);
  const getUnCompletedTodos = () => todos.filter(({ completed }) => !completed);
  const stopLoadings = () => {
    setIsLoading(false);
    setLoadingTodosIds([]);
  };

  useEffect(() => {
    notify('Loading todos...', NotificationType.Loading);

    getTodos(USER_ID)
      .then((fetchedTodos) => {
        setTodos(fetchedTodos);
        notify('Successfully loaded todos!', NotificationType.Success);
      })
      .catch(() => {
        notify('Unable to load todos!', NotificationType.Error);
      });
  }, []);

  const [activeTodosCount, completedTodosCount] = useMemo(
    () => [getUnCompletedTodos().length, getCompletedTodos().length],
    [todos],
  );

  const visibleTodos = useMemo(() => {
    return getFilteredTodos(todos, filterType);
  }, [todos, filterType]);

  const handleAddTodo = (title: string) => {
    setIsLoading(true);
    notify('Adding new todo...', NotificationType.Loading);

    if (!title.length) {
      setIsLoading(false);
      notify("Title can't be empty!", NotificationType.Error);
    } else {
      const newTodo = {
        id: 0,
        userId: USER_ID,
        completed: false,
        title,
      };

      setTempTodo(newTodo);
      setLoadingTodosIds((prev: number[]) => [...prev, newTodo.id]);

      postTodo(USER_ID, newTodo)
        .then((todo) => {
          setTodos((prevTodos) => {
            notify('Successfully added new todo!', NotificationType.Success);

            return [...prevTodos, todo];
          });
        })
        .catch(() => {
          notify('Unable to add a todo!', NotificationType.Error);
        })
        .finally(() => {
          setTempTodo(null);
          stopLoadings();
        });
    }
  };

  const handleDeleteTodo = useCallback(
    (id: number) => {
      setIsLoading(true);
      setLoadingTodosIds((prev: number[]) => [...prev, id]);
      notify('Deleting todo...', NotificationType.Loading);

      return deleteTodo(id)
        .then(() => {
          setTodos((prevTodos) => {
            notify('Successfully deleted a todo!', NotificationType.Success);

            return prevTodos.filter((todo) => todo.id !== id);
          });
        })
        .catch(() => {
          notify('Unable to delete a todo!', NotificationType.Error);
        })
        .finally(() => {
          setTempTodo(null);
          stopLoadings();
        });
    },
    [deleteTodo],
  );

  const handleDeleteCompleted = () => {
    getCompletedTodos().forEach(({ id }) => {
      handleDeleteTodo(id).then(() => setTodos(getUnCompletedTodos()));
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <LoadingTodosContext.Provider
      value={{
        isLoading,
        loadingTodosIds,
      }}
    >
      <div className="flex pt-20 min-h-screen bg-base-200 justify-center selection:bg-primary selection:text-white">
        <div className="card xs:max-sm:w2/3 md:w-1/2 lg:w-1/3 bg-base-100 h-3/4 shadow-xl">
          <div className="card-body">
            <h1 className="text-3xl font-bold text-center text-primary mb-4">
              ToDo
              <span className="text-secondary">{' {App}'}</span>
            </h1>

            <Header onSubmit={handleAddTodo} />

            {todos.length > 0 && (
              <TodoFilter
                isAnyActiveTodos={activeTodosCount > 0}
                onClearCompleted={handleDeleteCompleted}
                filterType={filterType}
                changeFilterType={setFilterType}
                completedTodosCount={completedTodosCount}
              />
            )}

            <div className="divider my-2">
              {activeTodosCount > 0
                ? `${activeTodosCount} tasks left`
                : 'No tasks'}
            </div>

            <TodoList todos={visibleTodos} onDelete={handleDeleteTodo} />

            {tempTodo && (
              <TodoItem onDelete={handleDeleteTodo} todo={tempTodo} />
            )}
          </div>

          <Toaster />
        </div>
      </div>
    </LoadingTodosContext.Provider>
  );
};
