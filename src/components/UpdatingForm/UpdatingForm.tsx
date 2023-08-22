import React, { useEffect, useRef, useState } from 'react';

type Props = {
  title: string;
  id: number;
  deleteTodo: (todoId: number) => void;
  setIsUpdating: (isUpdating: boolean) => void;
  onUpdateTodo: (todoId: number, netTitle: string) => void;
};

export const UpdatingForm: React.FC<Props> = ({
  title,
  id,
  deleteTodo,
  setIsUpdating,
  onUpdateTodo,
}) => {
  const [newTitle, setNewTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const cancelEditing = () => {
    setIsUpdating(false);
  };

  const submit = () => {
    const trimmedNewTitle = newTitle.trim();

    if (trimmedNewTitle === title) {
      cancelEditing();

      return;
    }

    if (!trimmedNewTitle) {
      deleteTodo(id);

      return;
    }

    onUpdateTodo(id, trimmedNewTitle);
    setIsUpdating(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    submit();
  };

  const handleOnBlur = () => {
    submit();
  };

  const handleOnKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todo__title-field"
        value={newTitle}
        onChange={handleTitleChange}
        onBlur={handleOnBlur}
        onKeyUp={handleOnKeyUp}
        ref={inputRef}
      />
    </form>
  );
};
