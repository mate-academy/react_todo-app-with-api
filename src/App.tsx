/* eslint-disable jsx-a11y/control-has-associated-label */
// eslint-disable-next-line object-curly-newline
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import {
  deleteTodo, getTodos, postTodo, updateTodo,
} from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { FilterType } from './types/FilterType';
import { getFilteredTodos } from './utils/functions';
import { ErrorType } from './types/ErrorType';

const USER_ID = 7002;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [error, setError] = useState<ErrorType | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const activeTodosQuantity = todos.filter((todo) => !todo.completed).length;
  const completedTodosQuantity = todos.length - activeTodosQuantity;

  const showErrorNotification = (errorType: ErrorType) => {
    setError(errorType);
    setTimeout(() => setError(null), 3000);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        showErrorNotification(ErrorType.LOAD);
      });
  }, []);

  const visibleTodos = useMemo(() => {
    return getFilteredTodos(todos, filterType);
  }, [todos, filterType]);

  const handleAddTodo = (title: string) => {
    if (title.length === 0) {
      showErrorNotification(ErrorType.EMPTY);
    } else {
      const newTodo = {
        id: 0,
        userId: USER_ID,
        completed: false,
        title,
      };

      setTempTodo(newTodo);
      setError(null);

      postTodo(newTodo)
        .then((todo) => {
          setTodos((prevTodos) => {
            return [...prevTodos, todo];
          });
        })
        .catch(() => {
          showErrorNotification(ErrorType.ADD);
        })
        .finally(() => {
          setTempTodo(null);
        });
    }
  };

  const handleDeleteTodo = useCallback(
    (id: number) => {
      setLoadingTodoIds((state) => [...state, id]);

      return deleteTodo(id)
        .then(() => {
          setTodos((prevTodos) => {
            return prevTodos.filter((todo) => todo.id !== id);
          });
        })
        .catch(() => {
          showErrorNotification(ErrorType.DELETE);
        })
        .finally(() => {
          setTempTodo(null);
          setLoadingTodoIds([]);
        });
    },
    [deleteTodo],
  );

  const handleClearCompleted = () => {
    todos.filter((todo) => todo.completed).forEach((todo) => {
      handleDeleteTodo(todo.id)
        .then(() => setTodos(todos.filter(({ completed }) => !completed)));
    });
  };

  const handleUpdateTodo = (id: number, data: object) => {
    setLoadingTodoIds(state => [...state, id]);

    return updateTodo(id, data)
      .then(() => {
        setTodos(state => state.map(todo => {
          if (todo.id === id) {
            return { ...todo, ...data };
          }

          return todo;
        }));
      })
      .catch(() => {
        showErrorNotification(ErrorType.UPDATE);
      })
      .finally(() => {
        setLoadingTodoIds(state => state.filter(el => el !== id));
      });
  };

  const handleToggleAll = () => {
    const areAllTodosCompleted = todos.every((todo) => todo.completed);

    if (areAllTodosCompleted) {
      todos.forEach((todo) => {
        handleUpdateTodo(todo.id, { completed: false });
      });
    } else {
      const activeTodos = todos.filter((todo) => !todo.completed);

      activeTodos.forEach((todo) => {
        handleUpdateTodo(todo.id, { completed: true });
      });
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onSubmit={handleAddTodo}
          todos={todos}
          onToggleAll={handleToggleAll}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDelete={handleDeleteTodo}
              loadingTodoIds={loadingTodoIds}
              onUpdateTodo={handleUpdateTodo}
            />

            <TodoFooter
              setFilterType={setFilterType}
              filterType={filterType}
              activeTodosQuantity={activeTodosQuantity}
              completedTodosQuantity={completedTodosQuantity}
              onClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <div
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setError(null)}
        />

        {error}
      </div>
    </div>
  );
};
