import React, { useState, useRef, useEffect } from 'react';

import { TodoUpdateData } from '../../types/Todo';

type Props = {
  title: string,
  id: number,
  deleteTodo: (todoId: number) => void,
  updateTodo: (
    todoId: number,
    newTodoData: TodoUpdateData
  ) => void,
  setIsUpdating: (isUpdating: boolean) => void;
};

export const UpdatingTodos: React.FC<Props> = ({
  title,
  id,
  deleteTodo,
  updateTodo,
  setIsUpdating,
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

  const cancelEdiditing = () => {
    setIsUpdating(false);
  };

  const handleUpdateTodo = async () => {
    const normalizedTitle = newTitle.trim();

    if (normalizedTitle === title) {
      cancelEdiditing();

      return;
    }

    if (!normalizedTitle) {
      deleteTodo(id);

      return;
    }

    await updateTodo(id, { title: normalizedTitle });
    setIsUpdating(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    handleUpdateTodo();
  };

  const handleOnBlur = () => {
    handleUpdateTodo();
  };

  const handleOnKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      cancelEdiditing();
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
