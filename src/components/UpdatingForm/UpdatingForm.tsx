import React, { useState } from 'react';

import { Todo } from '../../types/Todo';

type Props = {
  title: string,
  id: number,
  deleteTodo: (todoId: number) => void,
  updateTodo: (
    todoId: number,
    newTodoData: Partial<Pick<Todo, 'title' | 'completed'>>
  ) => void,
  setIsUpdating: (isUpdating: boolean) => void;
};

export const UpdatingForm: React.FC<Props> = ({
  title,
  id,
  deleteTodo,
  updateTodo,
  setIsUpdating,
}) => {
  const [newTitle, setNewTitle] = useState(title);

  const cancelEditing = () => {
    setIsUpdating(false);
  };

  const submit = async () => {
    const trimmedNewTitle = newTitle.trim();

    if (trimmedNewTitle === title) {
      cancelEditing();

      return;
    }

    if (!trimmedNewTitle) {
      deleteTodo(id);

      return;
    }

    await updateTodo(id, { title: trimmedNewTitle });
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
        onChange={(event) => setNewTitle(event.target.value)}
        onBlur={handleOnBlur}
        onKeyUp={handleOnKeyUp}
      />
    </form>
  );
};
