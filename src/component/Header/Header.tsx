import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  setIsAddError: (error: string) => void;
  onSubmit: (todo: Todo) => Promise<void>;
  setTodo: (todo: Todo | undefined) => void;
  updateStatusTodo: (todo: Todo[]) => void;
  isDisabled: boolean;
  isAddError: string;
  isFocus: boolean;
};

export const Header: React.FC<Props> = ({
  todos,
  setIsAddError,
  onSubmit,
  isDisabled,
  isFocus,
  updateStatusTodo,
}) => {
  const [query, setQuery] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isDisabled) {
      inputRef.current?.focus();
    }
  }, [isDisabled]);

  useEffect(() => {
    if (isFocus) {
      inputRef.current?.focus();
    }
  }, [isFocus]);

  const reset = () => {
    setQuery('');
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsAddError('');
    setQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setIsAddError('');

    if (!query.trim()) {
      setIsAddError('Title should not be empty');

      return;
    }

    onSubmit({
      id: 0,
      userId: 2816,
      title: query.trim(),
      completed: false,
    })
      .then(reset)
      .catch(() => {
        setIsAddError('Unable to add a todo');
      });
  };

  return (
    <header className="todoapp__header">
      {todos && todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${todos?.filter(todo => todo.completed === true).length === todos.length ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={() =>
            updateStatusTodo(
              todos.filter(td => !td.completed).length === 0
                ? todos
                : todos.filter(td => !td.completed),
            )
          }
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleQueryChange}
          disabled={isDisabled}
          ref={inputRef}
          autoFocus={isFocus}
        />
      </form>
    </header>
  );
};
