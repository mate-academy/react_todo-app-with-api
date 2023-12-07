import React, { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  createTodo: ({ title, userId, completed }: Todo) => void
  userId: 11261
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  setHasTitleError: React.Dispatch<React.SetStateAction<boolean>>
};

export const TodoApp: React.FC<Props> = ({
  createTodo,
  userId,
  isLoading,
  setIsLoading,
  setHasTitleError,
}) => {
  const [title, setTitle] = useState('');
  const completed = false;

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setHasTitleError(false);
  };

  const resetForm = () => {
    setTitle('');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) {
      setHasTitleError(true);

      return;
    }

    setIsLoading(true);
    createTodo({ title, userId, completed } as Todo);
    resetForm();
  };

  return (
    <form onSubmit={event => handleSubmit(event)}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={handleTitle}
        disabled={isLoading}
      />
    </form>
  );
};
