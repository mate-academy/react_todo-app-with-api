import classNames from 'classnames';
import { FormEvent, useContext } from 'react';
import { TodoListContext } from '../../context/TodoListContext';

/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {
  isToggleAllActive: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onToggleAll: () => void;
};

export const TodoAppHeader: React.FC<Props> = ({
  isToggleAllActive,
  onInputChange,
  onSubmit,
  onToggleAll,
}) => {
  const { todoInputValue, isInputDisabled } = useContext(TodoListContext);

  return (
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
          disabled={isInputDisabled}
          value={todoInputValue}
          onChange={(event) => onInputChange(event.target.value)}
        />
      </form>
    </header>
  );
};
