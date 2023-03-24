/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import { TodoFilter } from './components/TodoFilter';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header';
import { TodoItem } from './components/TodoItem';
import type { Todo } from './types/Todo';

import { LoadingTodoContext } from './LoadingTodoContext';

import { deleteTodo, getTodos, postTodo } from './api/todos';
import { FilterType } from './enums/FilterType';
import { getFilteredTodos } from './utils/getFilteredTodos';

const USER_ID = 6712;

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterType, setFilterType] = useState(FilterType.All);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodoId, setLoadingTodoId] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const getCompletedTodos = () => todos.filter(({ completed }) => completed);
  const getUnCompletedTodos = () => todos.filter(({ completed }) => !completed);
  const clearNotification = () => setTimeout(() => setErrorMessage(''), 3000);

  const stopLoadings = () => {
    setIsLoading(false);
    setLoadingTodoId(0);
  };

  useEffect(() => {
    setErrorMessage('');
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos!');
        setTimeout(() => setErrorMessage(''), 3000);
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
    if (!title.length) {
      setErrorMessage("Title can't be empty");
      clearNotification();
      setIsLoading(false);
    } else {
      const newTodo = {
        id: 0,
        userId: USER_ID,
        completed: false,
        title,
      };

      setTempTodo(newTodo);
      setLoadingTodoId(newTodo.id);
      setErrorMessage('');

      postTodo(USER_ID, newTodo)
        .then((todo) => {
          setTodos((prevTodos) => {
            return [...prevTodos, todo];
          });
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo!');
          clearNotification();
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
      setLoadingTodoId(id);

      return deleteTodo(id)
        .then(() => {
          setTodos((prevTodos) => {
            return prevTodos.filter((todo) => todo.id !== id);
          });
        })
        .catch(() => {
          setErrorMessage('Unable to delete a todo!');
          clearNotification();
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
    <LoadingTodoContext.Provider
      value={{
        isLoading,
        todoId: loadingTodoId,
      }}
    >
      <div className="flex py-10 min-h-screen bg-base-200 justify-center selection:bg-primary selection:text-white">
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

          <div
            className={classNames(
              'notification',
              'is-danger',
              'is-light',
              'has-text-weight-normal',
              {
                hidden: !errorMessage,
              },
            )}
          >
            <button
              type="button"
              className="delete"
              onClick={() => setErrorMessage('')}
            />
            {errorMessage}
          </div>
        </div>
      </div>
    </LoadingTodoContext.Provider>
  );
};
