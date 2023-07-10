/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useMemo,
  useEffect,
  useState,
  useCallback,
} from 'react';
import cn from 'classnames';
import { Todo, UpdateTodoArgs } from './types/Todo';
import {
  createTodo,
  deleteTodo,
  getTodos,
  patchTodo,
} from './api/todos';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { TodoForm } from './components/TodoForm';
import { ErrorMessage } from './components/ErrorMessage';
import { StatusFilterType } from './types/StatusFilterType';
import { StatusFilter } from './components/StatusFilter';

const USER_ID = 10897;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState(StatusFilterType.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([0]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError('Loading todos failed'));
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (error) {
      timeout = setTimeout(() => {
        setError(null);
      }, 3000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case StatusFilterType.COMPLETED:
        return completedTodos;

      case StatusFilterType.ACTIVE:
        return activeTodos;

      default:
        return todos;
    }
  }, [todos, filter]);

  const handleErrorClose = () => {
    setError(null);
  };

  const addTodo = useCallback(async (title: string) => {
    try {
      const newTodo = {
        userId: USER_ID,
        completed: false,
        title,
      };

      setTempTodo({
        id: 0,
        ...newTodo,
      });

      const createdTodo = await createTodo(newTodo);

      setTodos((prevTodos) => [...prevTodos, createdTodo]);
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  }, []);

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      setLoadingTodoIds(prevTodoId => [...prevTodoId, todoId]);
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setLoadingTodoIds([0]);
    }
  }, []);

  const handleClearCompletedTodos = () => {
    completedTodos.forEach(async (todo) => {
      await removeTodo(todo.id);
    });
  };

  const updateTodo = useCallback(async (
    todoId: number,
    args: UpdateTodoArgs,
  ) => {
    try {
      setLoadingTodoIds(prevLoadingTodoIds => [...prevLoadingTodoIds, todoId]);
      const updatedTodo: Todo = await patchTodo(todoId, args);

      setTodos(prevTodos => prevTodos.map(todo => {
        if (todo.id !== todoId) {
          return todo;
        }

        return updatedTodo;
      }));
    } catch {
      setError('Unable to update a todo');
    } finally {
      setLoadingTodoIds((prevLoadingTodoIds) => (
        prevLoadingTodoIds.filter((id) => id !== todoId)));
    }
  }, []);

  const handleToggleAll = async () => {
    const allCompleted = todos.every(todo => todo.completed);

    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
    }));

    setTodos(updatedTodos);

    try {
      setLoadingTodoIds(prevLoadingTodoIds => (
        [...prevLoadingTodoIds, ...updatedTodos.map(todo => todo.id)]));
      await Promise.all(updatedTodos.map(todo => (
        updateTodo(todo.id, { completed: !allCompleted }))));
    } catch {
      setError('Unable to update todos');
    } finally {
      setLoadingTodoIds([]);
    }
  };

  const handleErrorThrow = (erorMessage: string) => {
    setError(erorMessage);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            aria-label="toggleAllCompletedTodos"
            type="button"
            className={cn('todoapp__toggle-all', {
              active: activeTodos.length === 0,
            })}
            onClick={handleToggleAll}
          />
          <TodoForm
            onAddTodo={addTodo}
            handleErrorThrow={handleErrorThrow}
          />
        </header>

        <TodoList
          todos={filteredTodos}
          onRemoveTodo={removeTodo}
          tempTodo={tempTodo}
          loadingTodo={loadingTodoIds}
          onUpdateTodo={updateTodo}
          handleErrorThrow={handleErrorThrow}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${activeTodos.length} items left`}
            </span>

            <StatusFilter filter={filter} onFilterChange={setFilter} />

            {completedTodos && (
              <button
                type="button"
                className="todoapp__clear-completed"
                onClick={handleClearCompletedTodos}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      <ErrorMessage error={error} onErrorClose={handleErrorClose} />
    </div>
  );
};
