import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  isAllCompleted: boolean;
  onToggleAll: (state: boolean) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  isInputDisabled: boolean;
};

export const Header: React.FC<Props> = (props: Props) => {
  const {
    todos,
    isAllCompleted,
    onToggleAll,
    onSubmit,
    inputRef,
    title,
    setTitle,
    isInputDisabled,
  } = props;

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={() => onToggleAll(isAllCompleted)}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
