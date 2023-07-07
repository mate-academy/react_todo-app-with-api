/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { useState } from 'react';

type Props = {
  isFormDisabled: boolean;
  onTodoAdd: (title: string) => void;
  setError: (error: string) => void;
  isAllTodosCompleted: boolean;
  onToggleClick: () => void;
};

export const Header: React.FC<Props> = ({
  isFormDisabled,
  onTodoAdd,
  setError,
  isAllTodosCompleted,
  onToggleClick,
}) => {
  const [newTitle, setNewTitle] = useState('');

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTitle.trim()) {
      setError("Title can't be empty");

      return;
    }

    onTodoAdd(newTitle.trim());

    setNewTitle('');
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: isAllTodosCompleted })}
        onClick={onToggleClick}
      />

      <form
        onSubmit={handleFormSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={handleTitleChange}
          disabled={isFormDisabled}
        />
      </form>
    </header>
  );
};
