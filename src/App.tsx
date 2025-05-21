/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useRef } from 'react';
import { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import {
  getTodos,
  createTodo,
  deleteTodo,
  toggleTodo,
  renameTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { ErrorType } from './types/ErrorType';
import { FilterStatus } from './types/FilterStatus';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isTogglingAll, setIsTogglingAll] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorType>('');
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);

  useEffect(() => {
    setIsLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => setError('load'))
      .finally(() => setIsLoading(false));
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const getFilteredTodos = (
    allTodos: Todo[],
    currentFilter: FilterStatus,
  ): Todo[] => {
    return allTodos.filter(todo => {
      const matchesStatus =
        currentFilter === FilterStatus.All ||
        (currentFilter === FilterStatus.Active && !todo.completed) ||
        (currentFilter === FilterStatus.Completed && todo.completed);

      return matchesStatus;
    });
  };

  const filteredTodos = getFilteredTodos(todos, filter);
  const displayTodos = tempTodo ? [...filteredTodos, tempTodo] : filteredTodos;

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.all(
      completedTodos.map(todo =>
        deleteTodo(todo.id).then(() => {
          setTodos(prev => prev.filter(t => t.id !== todo.id));
        }),
      ),
    )
      .catch(() => setError('delete'))
      .finally(() => {
        inputRef.current?.focus();
      });
  };

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = query.trim();

    if (!trimmed) {
      setError('empty');

      return;
    }

    const temp = {
      id: 0,
      title: trimmed,
      completed: false,
      userId: USER_ID,
    };

    setIsLoading(true);
    setTempTodo(temp);
    setIsAdding(true);
    createTodo(trimmed)
      .then(createdTodo => {
        setTodos(prev => [...prev, createdTodo]);
        setQuery('');
        setError('');
        inputRef.current?.focus();
      })
      .catch(() => setError('add'))
      .finally(() => {
        setIsLoading(false);
        setIsAdding(false);
        setTempTodo(null);
      });
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
        inputRef.current?.focus();
      })
      .catch(() => setError('delete'))
      .finally(() => setDeletingId(null));
  };

  const handleToggle = (id: number) => {
    const currentTodo = todos.find(todo => todo.id === id);

    if (!currentTodo) {
      return;
    }

    const newStatus = !currentTodo.completed;

    setIsLoading(true);
    setTogglingId(id);

    toggleTodo(id, newStatus)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === id ? { ...todo, completed: newStatus } : todo,
          ),
        );
      })
      .catch(() => setError('update'))
      .finally(() => {
        setIsLoading(false);
        setTogglingId(null);
      });
  };

  const toggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);
    const newStatus = !allCompleted;

    setIsTogglingAll(true);

    Promise.all(
      todos
        .filter(todo => todo.completed !== newStatus)
        .map(todo =>
          toggleTodo(todo.id, newStatus).catch(() => {
            setError('update');

            return null;
          }),
        ),
    )
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo => ({
            ...todo,
            completed: newStatus,
          })),
        );
      })
      .finally(() => {
        setIsTogglingAll(false);
      });
  };

  const handleRename = (id: number, newTitle: string) => {
    const currentTodo = todos.find(todo => todo.id === id);

    if (!newTitle.trim()) {
      setError('empty');

      return;
    }

    if (currentTodo?.title === newTitle.trim()) {
      setEditingId(null);

      return;
    }

    setRenamingId(id);
    setEditingId(id);

    renameTodo(id, newTitle)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === id ? { ...todo, title: newTitle } : todo,
          ),
        );
        setEditingId(null);
      })
      .catch(() => setError('update'))
      .finally(() => {
        setRenamingId(null);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          query={query}
          handleQuery={handleQuery}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          inputRef={inputRef}
          toggleAll={toggleAll}
        />
        <TodoList
          todos={displayTodos}
          isLoading={isLoading}
          editingId={editingId}
          setEditingId={setEditingId}
          onDelete={handleDelete}
          deletingId={deletingId}
          isAdding={isAdding}
          togglingId={togglingId}
          isTogglingAll={isTogglingAll}
          renamingId={renamingId}
          handleToggle={handleToggle}
          handleRename={handleRename}
        />
        <TodoFooter
          todos={todos}
          currentFilter={filter}
          onFilterChange={setFilter}
          onClearCompleted={handleClearCompleted}
        />
      </div>
      <ErrorNotification
        error={error}
        setError={setError}
        onClose={() => setError('')}
      />
    </div>
  );
};
