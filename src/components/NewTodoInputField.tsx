/* eslint-disable jsx-a11y/control-has-associated-label */

import { useState } from 'react';

interface Props {
  hasTodos: boolean
  isActive: boolean
  handleAddNewTodo: (
    event: React.FormEvent<HTMLFormElement>,
    title: string,
  ) => void
  handleCompleteAll: () => void;

}

export default function NewTodoInputField({
  hasTodos,
  isActive,
  handleAddNewTodo,
  handleCompleteAll,
}: Props) {
  const [title, setTitle] = useState('');

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    handleAddNewTodo(event, title);
    setTitle('');
  };

  const handleToggleTodos = () => {
    handleCompleteAll();
  };

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={`todoapp__toggle-all ${isActive ? 'active' : ''}`}
          onClick={() => handleToggleTodos()}
        />
      )}

      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
}
