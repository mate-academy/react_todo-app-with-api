/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import {
  deleteTodo,
  getTodos,
  patchTodo,
  postTodo,
  USER_ID,
} from './api/todos';
import { Filters } from './constants/filter';
import { TodoList } from './components/TodoList';
import { NewTodo } from './components/NewTodo';
import { Todo } from './types/Todo';
import { TodoComp } from './components/TodoComp';
import { Filter } from './components/Filter';

const getPreparedTodos = (todos: Todo[], filter: Filters) => {
  const newTodos = [...todos];

  switch (filter) {
    case Filters.Active:
      return newTodos.filter(todo => todo.completed === false);
    case Filters.Completed:
      return newTodos.filter(todo => todo.completed === true);
    default:
      return newTodos;
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<Filters>(Filters.All);
  const [isLoading, setIsLoading] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<Todo['id'] | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setError('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const preparedTodos: Todo[] = getPreparedTodos(todos, filter);

  const activeTodos = todos.filter(todo => !todo.completed);

  const completedTodos = todos.filter(todo => todo.completed);

  const handleAddTodo = async (title: string) => {
    const newTodo = {
      title,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo({ ...newTodo, id: 0 });

    try {
      const createdTodo = await postTodo(newTodo);

      setTodos(prev => [...prev, createdTodo]);
    } catch {
      setError('Unable to add a todo');
      throw new Error();
    } finally {
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setLoadingTodoIds(prev => [...prev, id]);

    try {
      await deleteTodo(id);

      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setLoadingTodoIds(prev => prev.filter(loadingId => loadingId !== id));
    }
  };

  const handleDeleteCompletedTodos = async () => {
    const idsToDelete = completedTodos.map(todo => todo.id);

    if (idsToDelete.length === 0) {
      return;
    }

    setLoadingTodoIds(prev => [...prev, ...idsToDelete]);

    try {
      const results = await Promise.allSettled(
        idsToDelete.map(id => deleteTodo(id)),
      );

      const successfulIds = idsToDelete.filter(
        (_, i) => results[i].status === 'fulfilled',
      );

      setTodos(prev => prev.filter(todo => !successfulIds.includes(todo.id)));

      const hasErrors = results.some(r => r.status === 'rejected');

      if (hasErrors) {
        setError('Unable to delete a todo');
      }
    } catch {
      setError('Unexpected error while deleting todos');
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => !idsToDelete.includes(id)));
    }
  };

  const handleChangeTodoStatus = async (id: number, completed: boolean) => {
    setLoadingTodoIds(prev => [...prev, id]);

    try {
      const updatedTodo = await patchTodo(id, { completed });

      setTodos(prev =>
        prev.map(todo =>
          todo.id === id ? { ...todo, completed: updatedTodo.completed } : todo,
        ),
      );
    } catch {
      setError('Unable to update a todo');
    } finally {
      setLoadingTodoIds(prev => prev.filter(loadingId => loadingId !== id));
    }
  };

  const handleChangeAllTodoStatus = () => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const newStatus = !areAllCompleted;

    todos
      .filter(todo => todo.completed !== newStatus)
      .forEach(todo => handleChangeTodoStatus(todo.id, newStatus));
  };

  const handleSetIsEditing = (todo: Todo | null) => {
    if (todo) {
      setEditingTodoId(todo.id);
      setQuery(todo.title);
    } else {
      setEditingTodoId(null);
      setQuery('');
    }
  };

  const handleUpdateTodo = async (id: Todo['id'], text: string) => {
    const currentTodo = todos.find(todo => todo.id === id);

    if (!currentTodo) {
      return;
    }

    const trimmed = text.trim();

    if (trimmed === currentTodo.title) {
      setEditingTodoId(null);
      setQuery('');

      return;
    }

    if (!trimmed) {
      handleDeleteTodo(id);

      return;
    }

    setLoadingTodoIds(prev => [...prev, id]);

    try {
      const response = await patchTodo(id, { title: trimmed });

      setTodos(prev => prev.map(todo => (todo.id === id ? response : todo)));
      setEditingTodoId(null);
      setQuery('');
    } catch {
      setError('Unable to update a todo');
    } finally {
      setLoadingTodoIds(prev => prev.filter(loadingId => loadingId !== id));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && !isLoading && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: completedTodos.length === preparedTodos.length,
              })}
              onClick={handleChangeAllTodoStatus}
              data-cy="ToggleAllButton"
            />
          )}

          <NewTodo
            onSetError={setError}
            onAddTodo={handleAddTodo}
            inputRef={inputRef}
          />
        </header>

        <TodoList
          todos={preparedTodos}
          isLoading={isLoading}
          onDeleteTodo={handleDeleteTodo}
          loadingTodoIds={loadingTodoIds}
          onChangeTodoStatus={handleChangeTodoStatus}
          isEditing={editingTodoId}
          onSetIsEditing={handleSetIsEditing}
          query={query}
          onUpdateTodo={handleUpdateTodo}
          onSetQuery={setQuery}
        />

        {tempTodo && (
          <TodoComp
            todo={tempTodo}
            isLoading={true}
            onDeleteTodo={handleDeleteTodo}
            onChangeTodoStatus={handleChangeTodoStatus}
            onSetIsEditing={handleSetIsEditing}
            query={query}
            onUpdateTodo={handleUpdateTodo}
            onSetQuery={setQuery}
          />
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodos.length} items left`}
            </span>

            <Filter filter={filter} onFilterChange={setFilter} />
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={completedTodos.length === 0}
              onClick={handleDeleteCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: error === '' },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {error}
      </div>
    </div>
  );
};
