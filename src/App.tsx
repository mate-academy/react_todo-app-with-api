/* eslint-disable */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';
import { FilterStatus } from './types/FilterStatus';
import * as todoService from './api/todos';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [error, setError] = useState<ErrorMessage>(ErrorMessage.None);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const showError = (msg: ErrorMessage) => {
    setError(msg);
    setTimeout(() => setError(ErrorMessage.None), 3000);
  };

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => showError(ErrorMessage.Load))
      .finally(() => {
        inputRef.current?.focus();
      });
  }, []);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === FilterStatus.Active) return !todo.completed;
      if (filter === FilterStatus.Completed) return todo.completed;
      return true;
    });
  }, [todos, filter]);

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError(ErrorMessage.Title);
      return;
    }

    setTempTodo({
      id: 0,
      userId: todoService.USER_ID,
      title: trimmedTitle,
      completed: false,
    });
    setLoadingIds(prev => [...prev, 0]);

    todoService
      .createTodo({
        userId: todoService.USER_ID,
        title: trimmedTitle,
        completed: false,
      })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setTitle('');
      })
      .catch(() => showError(ErrorMessage.Add))
      .finally(() => {
        setTempTodo(null);
        setLoadingIds(prev => prev.filter(id => id !== 0));
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  };

  const handleDelete = (id: number): Promise<void> => {
    setLoadingIds(prev => [...prev, id]);

    return todoService
      .deleteTodo(id)
      .then(() => setTodos(prev => prev.filter(t => t.id !== id)))
      .catch(() => {
        showError(ErrorMessage.Delete);
        throw new Error();
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(curr => curr !== id));
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  };

  const handleUpdate = (id: number, data: Partial<Todo>): Promise<void> => {
    setLoadingIds(prev => [...prev, id]);
    return todoService
      .updateTodo(id, data)
      .then(updatedTodo => {
        setTodos(prev => prev.map(t => (t.id === id ? updatedTodo : t)));
      })
      .catch(() => {
        showError(ErrorMessage.Update);
        throw new Error();
      })
      .finally(() => setLoadingIds(prev => prev.filter(curr => curr !== id)));
  };

  const toggleAll = () => {
    const areAllCompleted = todos.every(todo => todo.completed);

    todos.forEach(todo => {
      if (todo.completed === areAllCompleted) {
        handleUpdate(todo.id, { completed: !areAllCompleted });
      }
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all ${todos.every(t => t.completed) ? 'active' : ''}`}
              data-cy="ToggleAllButton"
              onClick={toggleAll}
            />
          )}

          <form onSubmit={handleAddTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={inputRef}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={loadingIds.includes(0)}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              loadingIds={loadingIds}
            />
          ))}
          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              onDelete={async () => {}}
              onUpdate={async () => {}}
              loadingIds={[0]}
            />
          )}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(t => !t.completed).length} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === FilterStatus.All ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => setFilter(FilterStatus.All)}
              >
                All
              </a>
              <a
                href="#/active"
                className={`filter__link ${filter === FilterStatus.Active ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={() => setFilter(FilterStatus.Active)}
              >
                Active
              </a>
              <a
                href="#/completed"
                className={`filter__link ${filter === FilterStatus.Completed ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter(FilterStatus.Completed)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={() =>
                todos.filter(t => t.completed).forEach(t => handleDelete(t.id))
              }
              disabled={!todos.some(t => t.completed)}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!error ? 'hidden' : ''}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(ErrorMessage.None)}
        />
        {error}
      </div>
    </div>
  );
};
