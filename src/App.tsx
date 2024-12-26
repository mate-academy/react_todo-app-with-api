import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodos,
  deleteTodos,
  getTodos,
  updateTodos as updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';

import { Filter } from './types/FilterButton';
import { Error } from './types/ErrorMessage';
import { CompletedTodo } from './components/CompletedTodo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Error>(Error.Reset);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [inputValue, setInputValue] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [isToogleAll, setIsToogleAll] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const handleTodoDoubleClick = (id: number | null) => {
    setEditingTodoId(id);
  };

  const onDeleteTodo = async (todoId: number) => {
    setLoadingTodoIds(prev => [...prev, todoId]);
    try {
      await deleteTodos(todoId);

      setTodos(item => item.filter(todo => todo.id !== todoId));
    } catch (err) {
      setError(Error.Delete);
      throw err;
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const onAddTodo = async (todoTitle: string) => {
    setTempTodo({ id: 0, title: todoTitle, completed: false, userId: USER_ID });
    try {
      const newTodo = await addTodos({ title: todoTitle, completed: false });

      setTodos(item => [...item, newTodo]);
    } catch (err) {
      setError(Error.Add);
      throw err;
    } finally {
      setTempTodo(null);
    }
  };

  const onClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      onDeleteTodo(todo.id);
    });
  };

  const onUpdateTodo = async (todoUpdate: Todo) => {
    const oldTodos = [...todos];

    setLoadingTodoIds(prev => [...prev, todoUpdate.id]);

    try {
      await updateTodo(todoUpdate);
      setTodos(currentTodos =>
        currentTodos.map(todo => {
          return todo.id === todoUpdate.id ? todoUpdate : todo;
        }),
      );
    } catch (err) {
      setTodos(oldTodos);
      setError(Error.Update);
      throw err;
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoUpdate.id));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputValue.trim() === '') {
      setError(Error.Empty);

      return;
    }

    try {
      await onAddTodo(inputValue.trim());
      setInputValue('');
    } catch (err) {}
  };

  const inputFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (todos && !editingTodoId) {
      inputFocus();
    }
  }, [error, todos, editingTodoId]);

  useEffect(() => {
    const timer = setTimeout(() => setError(Error.Reset), 3000);

    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError(Error.Load));
  }, []);

  const filteredTodos = todos.filter(todo => {
    if (filter === Filter.Active) {
      return !todo.completed;
    }

    if (filter === Filter.Completed) {
      return todo.completed;
    }

    return Filter.All;
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  const unCompletedTodosCounter = todos.filter(todo => !todo.completed).length;
  const todosCompletedNum = todos.filter(todo => todo.completed).length;
  const allTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const onToggleAll = () => {
    if (unCompletedTodosCounter > 0) {
      const activeTodos = todos.filter(todo => !todo.completed);

      activeTodos.forEach(todo => {
        onUpdateTodo({ ...todo, completed: true });
      });
      setIsToogleAll(true);
    } else {
      todos.forEach(todo => {
        onUpdateTodo({ ...todo, completed: false });
      });
      setIsToogleAll(false);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: isToogleAll || allTodosCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={onToggleAll}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              value={inputValue}
              onChange={event => setInputValue(event.target.value)}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={inputRef}
              disabled={!!tempTodo}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <CompletedTodo
              error={error}
              editingTodoId={editingTodoId}
              handleTodoDoubleClick={handleTodoDoubleClick}
              key={todo.id}
              todo={todo}
              onDelete={onDeleteTodo}
              onUpdateTodo={onUpdateTodo}
              isLoading={loadingTodoIds.includes(todo.id)}
              setEditingTodoId={setEditingTodoId}
            />
          ))}
          {tempTodo && (
            <CompletedTodo
              error={error}
              setEditingTodoId={setEditingTodoId}
              editingTodoId={editingTodoId}
              handleTodoDoubleClick={handleTodoDoubleClick}
              todo={tempTodo}
              isLoading
              onDelete={onDeleteTodo}
              onUpdateTodo={onUpdateTodo}
            />
          )}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {unCompletedTodosCounter} items left
            </span>
            <nav className="filter" data-cy="Filter">
              <button
                className={classNames('filter__link', {
                  selected: filter === 'all',
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilter(Filter.All)}
              >
                All
              </button>

              <button
                className={classNames('filter__link', {
                  selected: filter === 'active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilter(Filter.Active)}
              >
                Active
              </button>

              <button
                className={classNames('filter__link', {
                  selected: filter === 'completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter(Filter.Completed)}
              >
                Completed
              </button>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={onClearCompleted}
              disabled={todosCompletedNum === 0}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(Error.Reset)}
        />
        {error}
      </div>
    </div>
  );
};
