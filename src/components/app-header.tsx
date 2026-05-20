import React, { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { Errors } from '../types/errors';
import { addTodo, USER_ID } from '../api/todos';

type Props = {
  setError: (val: string | null) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[] | null>>;
  setTempTodo: (todo: Todo | null) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  onUpdateTodoStatus: (todo: Todo[]) => void;
  todos: Todo[] | null;
  isAllCompleted: boolean | undefined;
};

export const AppHeader: React.FC<Props> = ({
  setError,
  setTodos,
  setTempTodo,
  inputRef,
  onUpdateTodoStatus,
  todos,
  isAllCompleted,
}) => {
  const [query, setQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const addToDo = ({
    title,
    completed,
  }: {
    title: string;
    completed: boolean;
  }) => {
    setIsAdding(true);
    setTempTodo({
      id: 0,
      title,
      completed,
      userId: USER_ID,
    });

    addTodo({ title, completed, userId: USER_ID })
      .then((newTodo: Todo) => {
        setTodos(prev => (prev ? [...prev, newTodo] : [newTodo]));
        setError(null);
        setQuery('');
      })
      .catch(() => {
        setError(Errors.errorAdd);
      })
      .finally(() => {
        setIsAdding(false);
        setTempTodo(null);
        setTimeout(() => inputRef.current?.focus(), 0);
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!query.trim()) {
      setError(Errors.errorEmptyTitle);

      return;
    }

    addToDo({
      title: query.trim(),
      completed: false,
    });
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  return (
    <header className="todoapp__header">
      {!!todos?.length && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={`todoapp__toggle-all ${isAllCompleted ? 'active' : ''}`}
          onClick={() => {
            if (todos) {
              onUpdateTodoStatus(todos);
            }
          }}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={e => {
            if (isAdding) {
              return;
            }

            setQuery(e.target.value);
            setError(null);
          }}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
