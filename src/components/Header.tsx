import React, { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  setErr: (err: string | null) => void;
  addTodo: (title: string) => void;
  tempTodo: Todo | null;
  toggleAllTodos: () => void;
};

export const Header: React.FC<Props> = ({
  setErr,
  addTodo,
  tempTodo,
  toggleAllTodos,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newTodoTitle.trim() === '') {
      setErr('Title can\'t be empty');

      return;
    }

    addTodo(newTodoTitle);
    setNewTodoTitle('');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleToggleAll = () => {
    toggleAllTodos();
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        onClick={handleToggleAll}
      />

      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={handleInputChange}
          disabled={tempTodo !== null}
        />
      </form>
    </header>
  );
};
