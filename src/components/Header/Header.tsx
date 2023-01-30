import React, { memo, useState } from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  onAddTodo: (newTitle: string) => Promise<void>;
  isAdding: boolean;
  changeAllTodos:() => void;
};

export const Header: React.FC<Props> = memo(({
  newTodoField,
  onAddTodo,
  isAdding,
  changeAllTodos,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onAddTodo(title);
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
        onClick={changeAllTodos}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => {
            setTitle(event.target.value);
          }}
          disabled={isAdding}
        />
      </form>
    </header>
  );
});
