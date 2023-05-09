import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { Category } from './utils/Category';
import { Error } from './utils/Error';
import { UserWarning } from './UserWarning';
import { TodoForm } from './Components/TodoForm';
import { TodoList } from './Components/TodoList';
import { TodoFilter } from './Components/TodoFilter';
import {
  addTodo, getTodos, removeTodo, updateTodoCompleted,
} from './api/todos';

const USER_ID = 10156;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [todoError, setTodoError] = useState<Error | null>(null);
  const [filterCategory, setFilterCategory] = useState(Category.All);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const hasTodos = todos.length > 0;
  const todosAmount = todos.filter(todo => !todo.completed).length;

  const handleError = useCallback((error: Error) => {
    setTodoError(error);
  }, []);

  useEffect(() => {
    let timerId: number | null = null;

    if (todoError) {
      timerId = window.setTimeout(() => {
        setTodoError(null);
      }, 3000);
    }

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [todoError]);

  const loadTodos = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      handleError(Error.LOAD);
    } finally {
      setIsInitialized(true);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleAdd = async () => {
    if (!todoTitle) {
      handleError(Error.TITLE);
      setIsLoading(false);

      return;
    }

    try {
      setIsLoading(true);
      const todo: Todo = {
        title: todoTitle,
        id: 0,
        userId: USER_ID,
        completed: false,
      };

      const tempTodo = await addTodo(todo);

      setTodos([
        ...todos,
        tempTodo,
      ]);

      setTodoTitle('');
    } catch {
      handleError(Error.ADD);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (todoId: number) => {
    try {
      await removeTodo(todoId);
      const filteredTodos = todos.filter(todo => todo.id !== todoId);

      setTodos(filteredTodos);
    } catch {
      handleError(Error.DELETE);
    }
  };

  const handleTodoUpdateCompleted = async (todoId: number) => {
    try {
      setTodos(prevTodos => {
        const foundTodo = prevTodos.find(todo => todo.id === todoId);

        updateTodoCompleted(todoId, !foundTodo?.completed);

        return (
          prevTodos.map(todo => {
            if (foundTodo?.id === todo.id) {
              foundTodo.completed = !foundTodo.completed;

              return foundTodo;
            }

            return todo;
          })
        );
      });
    } catch {
      // eslint-disable-next-line no-console
      handleError(Error.UPDATE);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTodoTitle = (title: string) => {
    setTodoTitle(title);
  };

  const hasCompleted = todos.some(todo => todo.completed);
  const clearCompletedTodo = useCallback(async () => {
    try {
      const allTodoId = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      const removedTodos = allTodoId.map(id => removeTodo(id));

      await Promise.all(removedTodos);

      const filteredTodos = todos.filter(todo => !todo.completed);

      setTodos(filteredTodos);
    } catch {
      handleError(Error.DELETE);
    }
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button type="button" className="todoapp__toggle-all active" />

          <TodoForm
            title={todoTitle}
            onChange={handleTodoTitle}
            onAdd={handleAdd}
            isLoading={isLoading}
          />
        </header>

        <TodoList
          todos={todos}
          onDelete={handleDelete}
          isLoading={isInitialized}
          category={filterCategory}
          onUpdate={handleTodoUpdateCompleted}
          isUpdating={isUpdating}
          setIsUpdating={setIsUpdating}
        />
        {hasTodos && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${todosAmount} items left`}
            </span>

            <TodoFilter
              filterCategory={filterCategory}
              changeCategory={setFilterCategory}
            />

            {hasCompleted && (
              <button
                type="button"
                className="todoapp__clear-completed"
                onClick={clearCompletedTodo}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      <div className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !todoError },
      )}
      >
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
          type="button"
          className="delete"
          onClick={() => setTodoError(null)}
        />
        {todoError}
      </div>
    </div>
  );
};
