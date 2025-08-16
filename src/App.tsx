/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { Filter } from './types/Filter';
import { ErrorMessage } from './types/ErrorMessage';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { TodoForm } from './components/TodoForm';
import { Notification } from './components/Notification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [error, setError] = useState<ErrorMessage | ''>('');
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError(ErrorMessage.LOAD));
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [tempTodo, error]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [error]);

  const handleAddTodo = async (title: string) => {
    if (!title) {
      setError(ErrorMessage.EMPTY_TITLE);

      return false;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    try {
      const newTodo = await addTodo({
        userId: USER_ID,
        title,
        completed: false,
      });

      setTodos(prev => [...prev, newTodo]);

      return true;
    } catch {
      setError(ErrorMessage.ADD);

      return false;
    } finally {
      setTempTodo(null);
    }
  };

  const handleDelete = async (id: number) => {
    setLoadingIds(ids => [...ids, id]);

    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
      inputRef.current?.focus();
    } catch {
      setError(ErrorMessage.DELETE);
    } finally {
      setLoadingIds(ids => ids.filter(i => i !== id));
    }
  };

  const handleToggle = async (id: number) => {
    const todo = todos.find(t => t.id === id);

    if (!todo) {
      return;
    }

    setLoadingIds(ids => [...ids, id]);

    try {
      const updatedTodo = await updateTodo(id, { completed: !todo.completed });

      setTodos(prev => prev.map(t => (t.id === id ? updatedTodo : t)));
    } catch {
      setError(ErrorMessage.UPDATE);
    } finally {
      setLoadingIds(ids => ids.filter(i => i !== id));
    }
  };

  const handleUpdate = async (id: number, data: Partial<Todo>) => {
    setLoadingIds(ids => [...ids, id]);

    try {
      const updatedTodo = await updateTodo(id, data);

      setTodos(prev => prev.map(t => (t.id === id ? updatedTodo : t)));

      return true;
    } catch {
      setError(ErrorMessage.UPDATE);

      return false;
    } finally {
      setLoadingIds(ids => ids.filter(i => i !== id));
    }
  };

  const handleToggleAll = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const todosToUpdate = todos.filter(
      todo => todo.completed !== !allCompleted,
    );

    if (todosToUpdate.length === 0) {
      return;
    }

    const newCompletedStatus = !allCompleted;

    setLoadingIds(ids => [...ids, ...todosToUpdate.map(t => t.id)]);

    try {
      await Promise.all(
        todosToUpdate.map(todo =>
          updateTodo(todo.id, { completed: newCompletedStatus }),
        ),
      );

      setTodos(prev =>
        prev.map(todo => ({ ...todo, completed: newCompletedStatus })),
      );
    } catch {
      setError(ErrorMessage.UPDATE);
    } finally {
      setLoadingIds(ids =>
        ids.filter(id => !todosToUpdate.some(t => t.id === id)),
      );
    }
  };

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const handleClearCompleted = async () => {
    const completed = todos.filter(todo => todo.completed);

    await Promise.all(
      completed.map(async todo => {
        setLoadingIds(ids => [...ids, todo.id]);
        try {
          await deleteTodo(todo.id);
          setTodos(prev => prev.filter(t => t.id !== todo.id));
        } catch {
          setError(ErrorMessage.DELETE);
        } finally {
          setLoadingIds(ids => ids.filter(i => i !== todo.id));
        }
      }),
    );
    inputRef.current?.focus();
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={
                'todoapp__toggle-all' +
                (todos.every(t => t.completed) ? ' active' : '')
              }
              data-cy="ToggleAllButton"
              aria-label="Toggle all todos"
              onClick={handleToggleAll}
            />
          )}
          <TodoForm
            onSubmit={handleAddTodo}
            isAdding={!!tempTodo}
            inputRef={inputRef}
          />
        </header>
        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          loadingIds={loadingIds}
          onDelete={handleDelete}
          onToggle={handleToggle}
          onUpdate={handleUpdate}
        />
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodos.length} items left
            </span>
            <nav className="filter" data-cy="Filter">
              {(Object.keys(Filter) as Array<keyof typeof Filter>).map(
                filterKey => {
                  const filterValue = Filter[filterKey];

                  return (
                    <a
                      key={filterValue}
                      href={`#/${filterValue}`}
                      className={`filter__link${
                        filter === filterValue ? ' selected' : ''
                      }`}
                      data-cy={`FilterLink${
                        filterValue.charAt(0).toUpperCase() +
                        filterValue.slice(1)
                      }`}
                      onClick={e => {
                        e.preventDefault();
                        setFilter(filterValue);
                      }}
                    >
                      {filterValue.charAt(0).toUpperCase() +
                        filterValue.slice(1)}
                    </a>
                  );
                },
              )}
            </nav>
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
              disabled={completedTodos.length === 0}
            >
              Clear completed
            </button>
          </footer>
        )}
        <Notification error={error} onHide={() => setError('')} />
      </div>
    </div>
  );
};
