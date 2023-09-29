/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';

type Props = {
  activeTodosCount: number;
  onTodoAdd: (todoTitle: string) => Promise<void>;
  onAddTodoError: (errorMessage: string) => void;
  onToggle: () => void;
};

export const Header: React.FC<Props> = ({
  activeTodosCount,
  onTodoAdd,
  onAddTodoError,
  onToggle,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isAdding, setIsEditing] = useState(false);

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const preparedTodoTitle = todoTitle.trim();

    if (!preparedTodoTitle) {
      onAddTodoError('Title should not be empty');

      return;
    }

    setIsEditing(true);

    onTodoAdd(todoTitle)
      .then(() => {
        setTodoTitle('');
      })
      .finally(() => {
        setIsEditing(false);
      });
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {activeTodosCount > 0 && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
          onClick={onToggle}
        />
      )}

      {/* Add a todo on form submit */}
      <form
        onSubmit={onFormSubmit}
      >
        <input
          disabled={isAdding}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={onTitleChange}
        />
      </form>
    </header>
  );
};
