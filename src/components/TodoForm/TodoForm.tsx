import React, { useState } from 'react';

interface Props {
  addTodo: (title: string) => void;
  onError: (arg: string) => void | null;
}

export const TodoForm: React.FC<Props> = ({
  addTodo,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleSubmitButton = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (newTitle.trim()) {
      setIsLoading(true);

      await addTodo(newTitle);

      setIsLoading(false);
    }

    if (!isLoading) {
      setNewTitle('');
    }

    if (!newTitle.trim()) {
      onError("Title can't be empty");
    }
  };

  return (
    <form
      onSubmit={handleSubmitButton}
    >
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTitle}
        onChange={(event) => setNewTitle(event.target.value)}
        disabled={isLoading}
      />
    </form>
  );
};
