import React, { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  query: string;
  isEditing: boolean;
  onDelete: (todoId: number) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
};

export const TodoContent: React.FC<Props> = ({
  todo,
  query,
  onSubmit,
  onDelete,
  setQuery,
  isEditing,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <form
        onSubmit={onSubmit}
        onBlur={onSubmit}
      >
        <input
          type="text"
          ref={inputRef}
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
        />
      </form>
    );
  }

  return (
    <>
      <span>
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>
    </>
  );
};
