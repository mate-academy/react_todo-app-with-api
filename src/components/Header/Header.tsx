/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { useState } from 'react';

interface Props {
  onAddTodo: (title: string) => Promise<boolean>;
  allCompleted: boolean;
  onToggleAll: () => Promise<void>;
  isInputDisabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  hasTodos: boolean;
}

export const Header: React.FC<Props> = ({
  onAddTodo,
  allCompleted,
  onToggleAll,
  isInputDisabled,
  inputRef,
  hasTodos,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (await onAddTodo(title)) {
      setTitle('');
    }
  };

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={inputRef}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
