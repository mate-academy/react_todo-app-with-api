/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import classNames from 'classnames';
import {
  deleteTodo,
  getTodos,
  patchTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { Errors } from './types/Errors';
import { Error } from './components/Error';
import { Navigation } from './components/Navigation';
import { Filter } from './types/Filter';
import { NewTodo } from './components/NewTodo';
import { TodoList } from './components/TodoList';
import { LoaderContext } from './components/Context/LoaderContext';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.ALL);
  const [error, setError] = useState(Errors.NONE);
  const [isAdding, setIsAdding] = useState(false);
  const { setTodosOnLoad } = useContext(LoaderContext);

  const loadTodos = async () => {
    if (!user) {
      return;
    }

    const todosFromServer = await getTodos(user.id);

    setTodos(todosFromServer);
  };

  useEffect(() => {
    loadTodos();
  }, [user]);

  const filterTodos = useCallback((filterBy: Filter) => (
    todos.filter(todo => {
      switch (filterBy) {
        case Filter.ALL:
          return todo;

        case Filter.ACTIVE:
          return !todo.completed;

        case Filter.COMPLETED:
          return todo.completed;

        default:
          return todo;
      }
    })), [todos, filter]);

  const filteredTodos = filterTodos(filter);

  const completedTodos = filterTodos(Filter.COMPLETED);

  const activeTodos = todos.filter(todo => !todo.completed);

  const removeError = useCallback(() => {
    setError(Errors.NONE);
  }, []);

  const handleError = useCallback((errorText: Errors) => {
    setError(errorText);
    setTimeout(removeError, 3000);
  }, []);

  const removeTodo = useCallback(async (todoId: number) => {
    setTodosOnLoad((current) => [...current, todoId]);

    try {
      await deleteTodo(todoId);

      await loadTodos();
    } catch {
      handleError(Errors.DELETE);
    }

    setTodosOnLoad([]);
  }, []);

  const updateTodo = useCallback(async (
    todoId: number,
    data: Partial<Todo>,
  ) => {
    setTodosOnLoad((current) => [...current, todoId]);

    try {
      await patchTodo(todoId, data);

      await loadTodos();
    } catch {
      handleError(Errors.UPDATE);
    }

    setTodosOnLoad([]);
  }, []);

  const updateStatusTodos = useCallback(async () => {
    if (activeTodos.length) {
      await Promise.all(activeTodos.map(todo => (
        updateTodo(todo.id, { completed: true })
      )));
    } else {
      await Promise.all(todos.map((todo) => (
        updateTodo(todo.id, { completed: !todo.completed })
      )));
    }

    await loadTodos();
  }, [todos]);

  const removeCompletedTodos = useCallback(async () => {
    await Promise.all(completedTodos.map((todo) => (
      removeTodo(todo.id))));

    await loadTodos();
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: !activeTodos.length,
              })}
              onClick={updateStatusTodos}
            />
          )}

          <NewTodo
            loadTodos={loadTodos}
            handleError={handleError}
            isAdding={isAdding}
            setIsAdding={setIsAdding}
          />
        </header>

        <TodoList
          todos={filteredTodos}
          onRemove={removeTodo}
          onUpdate={updateTodo}
          isAdding={isAdding}
        />
        {(todos.length || isAdding) && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${activeTodos.length} items left`}
            </span>

            <Navigation
              isSelected={filter}
              onFilterTodos={setFilter}
            />

            {completedTodos.length > 0 && (
              <button
                data-cy="ClearCompletedButton"
                type="button"
                className="todoapp__clear-completed"
                onClick={removeCompletedTodos}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      <Error
        error={error}
        onRemoveError={removeError}
      />
    </div>
  );
};
