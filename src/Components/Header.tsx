import React, { useState } from 'react';
import classNames from 'classnames';

interface Props {
  allCompleted: boolean;
  onAdd: (title: string, setTitle: () => void) => void;
  isAdding: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onToggleAll: () => void;
  hasTodos: boolean;
}

export const Header: React.FC<Props> = ({
  allCompleted,
  onAdd,
  isAdding,
  inputRef,
  onToggleAll,
  hasTodos,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAdd(title, () => setTitle(''));
  };

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isAdding}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
