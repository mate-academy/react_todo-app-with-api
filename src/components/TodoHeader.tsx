import React, {
  FormEvent, useEffect, useRef,
} from 'react';
import { Todo } from '../types/Todo';
import { ErrorType } from '../types/ErrorType';

type Props = {
  onSubmit: (todo: Todo) => void;
  USER_ID: number;
  setError: React.Dispatch<React.SetStateAction<ErrorType | null>>;
  tempTodo: Todo | null;
  query: string;
  setQuery: (query: string) => void;
  handleToogleAll: () => void;
};

export const TodoHeader: React.FC<Props> = (
  {
    onSubmit,
    USER_ID,
    setError,
    tempTodo,
    query,
    setQuery,
    handleToogleAll,
  },
) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (query.trim()) {
      event.preventDefault();

      onSubmit(
        {
          userId: USER_ID,
          title: query.trim(),
          completed: false,
          id: 0,
        },
      );
      setQuery('');
    } else {
      setError(ErrorType.EmptyTitle);
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        aria-label="Toggle All"
        onClick={handleToogleAll}
      />

      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleQueryChange}
          ref={inputRef}
          disabled={!!tempTodo}
        />
      </form>
    </header>
  );
};
