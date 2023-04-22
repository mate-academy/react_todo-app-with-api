import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  updateTitle: (id: number, value: string) => void,
  setIsEditing: (value: number) => void,
};

export const UpdateTodosTitle: React.FC<Props> = ({
  todo,
  updateTitle,
  setIsEditing,
}) => {
  const [newTitle, setNewTitle] = useState(todo.title);

  const handleKeUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setNewTitle(todo.title);
      setIsEditing(0);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleBlur = () => {
    if (todo.title !== newTitle) {
      updateTitle(todo.id, newTitle);
    } else {
      setIsEditing(0);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateTitle(todo.id, newTitle);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={newTitle}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyUp={handleKeUp}
          autoFocus // eslint-disable-line
        />
      </form>
    </>
  );
};
