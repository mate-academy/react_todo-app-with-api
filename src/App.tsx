import React, { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { Category } from './utils/Category';
import { Error } from './utils/Error';
import { UserWarning } from './UserWarning';
import { TodoForm } from './Components/TodoForm';
import { TodoList } from './Components/TodoList';
import { TodoFilter } from './Components/TodoFilter';
import { addTodo, getTodos, removeTodo } from './api/todos';

const USER_ID = 10156;

export const App: React.FC = () => {
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [todoError, setTodoError] = useState<Error | null>(null);
  const [filterCategory, setFilterCategory] = useState(Category.All);
  const [isLoading, setIsLoading] = useState(false);
  const todosAmount = visibleTodos.length;
  const hasCompleted = useMemo(() => {
    return visibleTodos.some(todo => todo.completed);
  }, [visibleTodos]);

  const handleError = useCallback((error: Error) => {
    setTodoError(error);
    window.setTimeout(() => {
      setTodoError(null);
    }, 3000);
  }, []);

  const loadTodos = async () => {
    try {
      const todos = await getTodos(USER_ID);

      setVisibleTodos(todos);
    } catch {
      handleError(Error.LOAD);
    }
  };

  // eslint-disable-next-line no-console
  console.log(todoError);
  const filterTodos = async (category: Category) => {
    const allTodos = await getTodos(USER_ID);

    const filteredTodos = allTodos.filter(todo => {
      switch (category) {
        case Category.Active:
          return !todo.completed;
        case Category.Completed:
          return todo.completed;
        default:
          return true;
      }
    });

    setVisibleTodos(filteredTodos);
  };

  useEffect(() => {
    filterTodos(filterCategory);
  }, [filterCategory]);

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

      setVisibleTodos([
        ...visibleTodos,
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
      const filteredTodos = visibleTodos.filter(todo => todo.id !== todoId);

      setVisibleTodos(filteredTodos);
    } catch {
      handleError(Error.DELETE);
    }
  };

  const handleTodoTitle = (title: string) => {
    setTodoTitle(title);
  };

  const clearCompletedTodo = async () => {
    try {
      const allTodoId = visibleTodos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      visibleTodos.forEach(todo => {
        if (allTodoId.includes(todo.id)) {
          removeTodo(todo.id);
        }
      });
    } catch {
      handleError(Error.DELETE);
    }
  };
  // const handleTodoUpdate = async (todoId: number, title: string) => {
  //   try {
  //     await updateTodo(todoId, title);
  //   } catch {
  //     handleError(Error.UPDATE);
  //   }
  // };

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
          todos={visibleTodos}
          onDelete={handleDelete}
        />

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
      </div>

      {todoError && (
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
      )}
    </div>
  );
};
