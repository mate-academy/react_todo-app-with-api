import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './types/common';

const USER_ID = 4050;

type FilterType = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [error, setError] = useState<ErrorMessage | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(ErrorMessage.LoadTodos));
  }, []);

  useEffect(() => {
    if (!isSubmitting) {
      inputRef.current?.focus();
    }
  }, [isSubmitting]);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => setError(null), 3000);

    return () => clearTimeout(timer);
  }, [error]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();

    const title = newTitle.trim();

    if (!title) {
      setError(ErrorMessage.EmptyTitle);

      return;
    }

    const newTodo = { id: 0, title, completed: false, userId: USER_ID };

    setIsSubmitting(true);
    setTempTodo(newTodo);
    setProcessingIds(prev => [...prev, 0]);

    setTimeout(async () => {
      try {
        const created: Todo = await client.post('/todos', newTodo);

        setTodos(prev => [...prev, created]);
        setNewTitle('');
      } catch {
        setError(ErrorMessage.AddTodo);
      } finally {
        setIsSubmitting(false);
        setTempTodo(null);
        setProcessingIds(prev => prev.filter(id => id !== 0));
      }
    }, 0);
  };

  const handleDeleteTodo = (id: number) => {
    setProcessingIds(prev => [...prev, id]);

    setTimeout(async () => {
      try {
        await client.delete(`/todos/${id}`);
        setTodos(prev => prev.filter(todo => todo.id !== id));
      } catch {
        setError(ErrorMessage.DeleteTodo);
      } finally {
        setProcessingIds(prev => prev.filter(pid => pid !== id));
        inputRef.current?.focus();
      }
    }, 0);
  };

  const handleClearCompleted = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => handleDeleteTodo(todo.id));
  };

  const handleToggleTodo = (id: number) => {
    const todo = todos.find(t => t.id === id);

    if (!todo) {
      return;
    }

    setProcessingIds(prev => [...prev, id]);

    setTimeout(async () => {
      try {
        const updatedTodo = await client.patch<Todo>(`/todos/${id}`, {
          completed: !todo.completed,
        });

        setTodos(prev => prev.map(t => (t.id === id ? updatedTodo : t)));
      } catch {
        setError(ErrorMessage.UpdateTodo);
      } finally {
        setProcessingIds(prev => prev.filter(pid => pid !== id));
      }
    }, 0);
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);
    const targetStatus = !allCompleted;
    const todosToUpdate = todos.filter(todo => todo.completed !== targetStatus);

    todosToUpdate.forEach(todo => {
      setProcessingIds(prev => [...prev, todo.id]);

      setTimeout(async () => {
        try {
          const updatedTodo = await client.patch<Todo>(`/todos/${todo.id}`, {
            completed: targetStatus,
          });

          setTodos(prev => prev.map(t => (t.id === todo.id ? updatedTodo : t)));
        } catch {
          setError(ErrorMessage.UpdateTodo);
        } finally {
          setProcessingIds(prev => prev.filter(pid => pid !== todo.id));
        }
      }, 0);
    });
  };

  const handleRenameTodo = (id: number, title: string): Promise<void> => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return new Promise((resolve, reject) => {
        setProcessingIds(prev => [...prev, id]);

        setTimeout(async () => {
          try {
            await client.delete(`/todos/${id}`);
            setTodos(prev => prev.filter(todo => todo.id !== id));
            resolve();
          } catch {
            setError(ErrorMessage.DeleteTodo);
            reject();
          } finally {
            setProcessingIds(prev => prev.filter(pid => pid !== id));
          }
        }, 0);
      });
    }

    return new Promise((resolve, reject) => {
      setProcessingIds(prev => [...prev, id]);

      setTimeout(async () => {
        try {
          const updatedTodo = await client.patch<Todo>(`/todos/${id}`, {
            title: trimmedTitle,
          });

          setTodos(prev =>
            prev.map(todo => (todo.id === id ? updatedTodo : todo)),
          );
          resolve();
        } catch {
          setError(ErrorMessage.UpdateTodo);
          reject();
        } finally {
          setProcessingIds(prev => prev.filter(pid => pid !== id));
        }
      }, 0);
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          handleAddTodo={handleAddTodo}
          handleToggleAll={handleToggleAll}
          inputRef={inputRef}
          isLoading={isSubmitting}
        />

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todos={visibleTodos}
            onDelete={handleDeleteTodo}
            onToggle={handleToggleTodo}
            onRename={handleRenameTodo}
            processingIds={processingIds}
            tempTodo={tempTodo}
          />
        )}

        {todos.length > 0 && (
          <footer data-cy="Footer" className="todoapp__footer">
            <span data-cy="TodosCounter" className="todo-count">
              {activeTodosCount} items left
            </span>

            <nav data-cy="Filter" className="filter">
              <a
                href="#/"
                data-cy="FilterLinkAll"
                className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                data-cy="FilterLinkActive"
                className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
                onClick={() => setFilter('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                data-cy="FilterLinkCompleted"
                className={`filter__link ${
                  filter === 'completed' ? 'selected' : ''
                }`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              data-cy="ClearCompletedButton"
              className="todoapp__clear-completed"
              onClick={handleClearCompleted}
              disabled={!hasCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}

        <div
          data-cy="ErrorNotification"
          className={`notification is-danger is-light ${error ? '' : 'hidden'}`}
        >
          <button
            type="button"
            className="delete"
            data-cy="HideErrorButton"
            onClick={() => setError(null)}
          />

          {error || ''}
        </div>
      </div>
    </div>
  );
};
