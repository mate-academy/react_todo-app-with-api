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
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { setTodoOnLoad, setTodosOnLoad } = useContext(LoaderContext);

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
    setError('');
  }, []);

  const handleError = useCallback((errorText: string) => {
    setError(errorText);
    setTimeout(removeError, 3000);
  }, []);

  const removeTodo = useCallback(async (todoId: number) => {
    setTodoOnLoad(todoId);

    try {
      await deleteTodo(todoId);

      await loadTodos();
    } catch {
      handleError('Unable to delete a todo');
    }

    setTodoOnLoad(-1);
  }, []);

  const updateTodo = useCallback(async (
    todoId: number,
    data: Partial<Todo>,
  ) => {
    setTodoOnLoad(todoId);

    try {
      await patchTodo(todoId, data);

      await loadTodos();
    } catch {
      handleError('Unable to update a todo');
    }

    setTodoOnLoad(-1);
  }, []);

  const updateStatusTodos = useCallback(async () => {
    if (activeTodos.length > 0) {
      setTodosOnLoad(activeTodos.map(todo => todo.id));

      await Promise.all(activeTodos.map((todo) => (
        updateTodo(
          todo.id,
          { completed: true },
        ))));
    } else {
      setTodosOnLoad(todos.map(todo => todo.id));

      await Promise.all(todos.map((todo) => (
        updateTodo(
          todo.id,
          { completed: !todo.completed },
        ))));
    }

    await loadTodos();

    setTodosOnLoad([]);
  }, [todos]);

  const removeCompletedTodos = useCallback(async () => {
    setTodosOnLoad(completedTodos.map(todo => todo.id));

    await Promise.all(completedTodos.map((todo) => (
      removeTodo(todo.id))));

    await loadTodos();

    setTodosOnLoad([]);
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
                active: activeTodos.length === 0,
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

        {todos.length !== 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              onRemoveTodo={removeTodo}
              onUpdateTodo={updateTodo}
              isAdding={isAdding}
            />

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
          </>
        )}
      </div>

      {error && (
        <Error
          error={error}
          onRemoveError={removeError}
        />
      )}
    </div>
  );
};
