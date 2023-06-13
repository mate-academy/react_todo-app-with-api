/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';

interface InputFieldProps {
  handleSubmitTodo: (
    event: React.FormEvent<HTMLFormElement>,
    addedTitle: string,
  ) => void,
  handleSetAllCompleted: () => void,
  hasTodos: boolean,
  active: boolean
}

export const InputField: React.FC<InputFieldProps> = ({
  handleSubmitTodo,
  handleSetAllCompleted,
  hasTodos,
  active,
}) => {
  const [newTitle, setNewTitle] = useState('');

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    handleSubmitTodo(event, newTitle);
    setNewTitle('');
  };

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={`todoapp__toggle-all ${active ? 'active' : ''}`}
          onClick={() => handleSetAllCompleted()}
        />
      )}

      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
