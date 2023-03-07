import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  setIsRenamed: (isRename: boolean) => void,
  deleteTodo: () => void,
  renameTodo: (todo: Todo, newTitle: string) => void,
};

export const TodoRename: React.FC<Props> = ({
  todo,
  setIsRenamed,
  deleteTodo,
  renameTodo,
}) => {
  const [newTitle, setNewTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!newTitle) {
      deleteTodo();

      return;
    }

    if (newTitle !== todo.title) {
      renameTodo(todo, newTitle);
    }

    setIsRenamed(false);
  };

  const reset = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleSubmit(event);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={newTitle}
        ref={inputRef}
        onChange={handleChange}
        onKeyUp={reset}
        onBlur={handleSubmit}
        onSubmit={handleSubmit}
      />
    </form>
  );
};
