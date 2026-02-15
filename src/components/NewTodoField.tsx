import React, { FormEvent } from 'react';
import classNames from 'classnames';

type Props = {
  value: string;
  disabled: boolean;
  hasTodos: boolean;
  allCompleted: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onChange: (value: string) => void;
  onToggleAll: () => void;
  onSubmit: () => void;
};

export const NewTodoField: React.FC<Props> = ({
  value,
  disabled,
  hasTodos,
  allCompleted,
  inputRef,
  onChange,
  onToggleAll,
  onSubmit,
}) => {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
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
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          disabled={disabled}
          onChange={event => onChange(event.target.value)}
          autoFocus
        />
      </form>
    </header>
  );
};
