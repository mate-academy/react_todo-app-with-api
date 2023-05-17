import classNames from 'classnames';
import { FormEvent } from 'react';

/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {
  todoInputValue: string;
  isAddDisabled: boolean;
  isToggleAllActive: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onToggleAll: () => void;
};

export const TodoAppHeader: React.FC<Props> = ({
  todoInputValue,
  isAddDisabled,
  isToggleAllActive,
  onInputChange,
  onSubmit,
  onToggleAll,
}) => (
  <header className="todoapp__header">
    <button
      type="button"
      className={classNames('todoapp__toggle-all', {
        active: isToggleAllActive,
      })}
      onClick={onToggleAll}
    />

    <form onSubmit={onSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={isAddDisabled}
        value={todoInputValue}
        onChange={(event) => onInputChange(event.target.value)}
      />
    </form>
  </header>
);
