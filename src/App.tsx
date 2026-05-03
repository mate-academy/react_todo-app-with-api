import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { TodoList } from './components/TodoList';
import { TodoItem } from './components/TodoItem';
import { ErrorNotification } from './components/ErrorNotification';
import { useError } from './hooks/useError';

type Status = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<Status>('all');
  const [isAdding, setIsAdding] = useState(false);

  const [title, setTitle] = useState('');

  const { error, setError } = useError();

  const activeTodos = todos.filter(todo => !todo.completed);
  const hasCompleted = todos.some(todo => todo.completed);
  const allCompleted = todos.every(todo => todo.completed);
  const inputRef = useRef<HTMLInputElement>(null);

  const completedTodos: Todo[] = todos.filter(todo => todo.completed);

  const filteredTodos = todos.filter(todo => {
    if (status === 'active') {
      return !todo.completed;
    }

    if (status === 'completed') {
      return todo.completed;
    }

    return true;
  });

  function handleDelete(id: number) {
    setDeletingId(id);

    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
        inputRef.current?.focus();
      })
      .catch(() => {
        setError('delete');
      })
      .finally(() => {
        setDeletingId(null);
      });
  }

  function handleClearCompleted() {
    completedTodos.forEach(todo => {
      handleDelete(todo.id);
    });
  }

  function handleUpdate(id: number, newTitle?: string, completed?: boolean) {
    setUpdatingId(id);

    const updatedData: Partial<Todo> = {};

    if (newTitle !== undefined) {
      updatedData.title = newTitle.trim();
    }

    if (completed !== undefined) {
      updatedData.completed = completed;
    }

    updateTodo(id, updatedData)
      .then(() => {
        setTodos(prev =>
          prev.map(item =>
            item.id === id ? { ...item, ...updatedData } : item,
          ),
        );
        setEditingId(null);
        inputRef.current?.focus();
      })
      .catch(() => {
        setError('update');
      })
      .finally(() => {
        setUpdatingId(null);
      });
  }

  function handleToggleAll() {
    const newCompleted = !allCompleted;

    todos.forEach(todo => {
      if (todo.completed !== newCompleted) {
        handleUpdate(todo.id, undefined, newCompleted);
      }
    });
  }

  useEffect(() => {
    setIsLoading(true);

    getTodos()
      .then((data: React.SetStateAction<Todo[]>) => {
        setTodos(data);
      })
      .catch(() => {
        setError('load');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [setError]);

  useEffect(() => {
    if (!isAdding && !error) {
      inputRef.current?.focus();
    }
  }, [isAdding, error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!isLoading && todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: allCompleted,
              })}
              onClick={handleToggleAll}
              data-cy="ToggleAllButton"
            />
          )}

          {/* Add a todo on form submit */}
          <form
            onSubmit={event => {
              event.preventDefault();

              if (!title.trim()) {
                setError('title');

                return;
              }

              const trimmedTitle = title.trim();

              const newTodo = {
                title: trimmedTitle,
                completed: false,
                userId: USER_ID,
              };

              const uiTodo = {
                id: 0,
                title: trimmedTitle,
                completed: false,
                userId: USER_ID,
              };

              setTempTodo(uiTodo);

              setIsAdding(true);

              addTodo(newTodo)
                .then((todoFromServer: Todo) => {
                  setTodos(prev => [...prev, todoFromServer]);
                  setTitle('');
                  setTempTodo(null);
                  setDeletingId(null);
                })
                .catch(() => {
                  setError('add');
                  setTempTodo(null);
                })
                .finally(() => {
                  setIsAdding(false);
                });
            }}
          >
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={isAdding}
              value={title}
              onChange={event => {
                setTitle(event.target.value);
              }}
            />
          </form>
        </header>
        {!isLoading && (
          <TodoList
            todos={filteredTodos}
            handleDelete={handleDelete}
            deletingId={deletingId}
            handleUpdate={handleUpdate}
            updatingId={updatingId}
            editingId={editingId}
            setEditingId={setEditingId}
          />
        )}
        {tempTodo && <TodoItem todo={tempTodo} isLoading={true} />}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodos.length} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: status === 'all',
                })}
                data-cy="FilterLinkAll"
                onClick={() => setStatus('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: status === 'active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => setStatus('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: status === 'completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setStatus('completed')}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!hasCompleted}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorNotification error={error} onClose={() => setError('')} />
    </div>
  );
};