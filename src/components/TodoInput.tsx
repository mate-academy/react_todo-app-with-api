import { FC, FormEvent } from 'react';
import classNames from 'classnames';

type Props = {
  handleFormSubmit: (x: FormEvent<HTMLFormElement>) => void,
  inputValue: string,
  setInputValue: (x: string) => void,
  inputIsDisabled: boolean,
  areAllCompleted: boolean,
  toggleAll: () => void,
};

export const TodoInput: FC<Props> = ({
  handleFormSubmit,
  inputValue,
  setInputValue,
  inputIsDisabled,
  areAllCompleted,
  toggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all',
          { active: areAllCompleted })}
        onClick={() => toggleAll()}
      />

      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          disabled={inputIsDisabled}
          onChange={(event) => setInputValue(event.target.value)}
        />
      </form>
    </header>
  );
};
