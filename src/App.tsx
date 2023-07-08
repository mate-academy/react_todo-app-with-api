/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updatingTodo,
} from './api/todos';
import { Todo, TodoData } from './types/Todo';
import { SelectedFiltering } from './types/SelectedType';
import { TodoList } from './TodoMain/TodoList';
import { TodoLoadingError } from './TodoLoadingError';
import { AddTodoForm } from './AddTodo/AddTodoForm';

const USER_ID = 10397;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoadingError, setIsLoadingError] = useState(false);
  const [filteringBy, setFilteringBy] = useState(SelectedFiltering.All);
  const [tempTodo, setTempTodo] = useState<TodoData | null>(null);
  const [isCreatingError, setIsCreatingError] = useState(false);
  const [isUpdatingError, setIsUpdatingError] = useState(false);
  const [todosForRemove, setTodosForRemove] = useState<Todo[]>([]);

  const loadTodos = useCallback(async () => {
    setIsLoadingError(false);

    try {
      const todosFromServer: Todo[] = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setIsLoadingError(true);
    }
  }, []);

  const addTodo = useCallback(async (todoData: TodoData) => {
    setIsCreatingError(false);
    setTempTodo(todoData);

    try {
      await createTodo(todoData);
      await loadTodos();
      setTempTodo(null);
    } catch {
      setIsCreatingError(true);
    }
  }, []);

  setTimeout(() => setIsCreatingError(false), 5000);
  setTimeout(() => setIsUpdatingError(false), 5000);

  const removeTodo = useCallback(async (todoDeletedId: number) => {
    await deleteTodo(todoDeletedId);

    loadTodos();
  }, []);

  const removeCompletedTodos = useCallback(async () => {
    const filtered = todos.filter(todo => (
      todo.completed
    ));

    setTodosForRemove(filtered);

    await Promise.all(filtered.map(todo => {
      return deleteTodo(todo.id);
    }));

    await loadTodos();
  }, [todos]);

  const updateTodoChek = useCallback(
    async (todoId: number, completed: boolean) => {
      setTodos(prevTodos => prevTodos.map((todo) => {
        return todo.id !== todoId ? todo : { ...todo, completed };
      }));

      try {
        await updatingTodo(todoId, { completed });
      } catch (error) {
        setIsUpdatingError(true);
      }

      setIsUpdatingError(false);
      loadTodos();
    }, [],
  );

  const updateTodoTitle = useCallback(
    async (todoId: number, title: string) => {
      setTodos(prevTodos => prevTodos.map((todo) => {
        return todo.id !== todoId ? todo : { ...todo, title };
      }));

      try {
        await updatingTodo(todoId, { title });
      } catch (error) {
        setIsUpdatingError(true);
      }

      setIsUpdatingError(false);
      loadTodos();
    }, [],
  );

  const todosPresent = todos.length > 0;
  const completedTodosPresent = todos.filter(({ completed }) => {
    return completed;
  }).length > 0;

  useEffect(() => {
    loadTodos();
  }, []);

  const visibleTodos = todos.filter(({ completed }) => {
    switch (filteringBy) {
      case SelectedFiltering.Active:
        return !completed;

      case SelectedFiltering.Completed:
        return completed;

      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <AddTodoForm
          setIsCreatingError={setIsCreatingError}
          addTodo={addTodo}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          removeTodo={removeTodo}
          updateTodoChek={updateTodoChek}
          updateTodoTitle={updateTodoTitle}
          setIsUpdatingError={setIsUpdatingError}
          todosForRemove={todosForRemove}
        />

        {isLoadingError && <TodoLoadingError />}

        {todosPresent && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${todos.filter(todo => !todo.completed).length} items left`}
            </span>

            <nav className="filter">
              <a
                href="#/"
                className={classNames(
                  'filter__link', {
                    selected: filteringBy === SelectedFiltering.All,
                  },
                )}
                onClick={() => setFilteringBy(SelectedFiltering.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames(
                  'filter__link', {
                    selected: filteringBy === SelectedFiltering.Active,
                  },
                )}
                onClick={() => setFilteringBy(SelectedFiltering.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames(
                  'filter__link', {
                    selected: filteringBy === SelectedFiltering.Completed,
                  },
                )}
                onClick={() => setFilteringBy(SelectedFiltering.Completed)}
              >
                Completed
              </a>
            </nav>

            {completedTodosPresent && (
              <button
                type="button"
                className="todoapp__clear-completed"
                onClick={removeCompletedTodos}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}

        {isCreatingError && (
          // eslint-disable-next-line max-len
          <div className="notification is-danger is-light has-text-weight-normal">
            <button
              type="button"
              className="delete"
              onClick={() => setIsCreatingError(false)}
            />
            Unable to add a todo
          </div>
        )}
        {isUpdatingError && (
          // eslint-disable-next-line max-len
          <div className="notification is-danger is-light has-text-weight-normal">
            <button
              type="button"
              className="delete"
              onClick={() => setIsUpdatingError(false)}
            />
            Unable to update todo
          </div>
        )}
      </div>
    </div>
  );
};
