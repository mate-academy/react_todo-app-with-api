import {
  FC, FormEvent, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';

type Props = {
  addTodo: (x: string) => void,
  areAllCompleted: boolean,
  toggleAll: () => void,
  inputIsDisabled: boolean,
};

export const TodoInput: FC<Props> = ({
  addTodo,
  areAllCompleted,
  toggleAll,
  inputIsDisabled,
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleFormSubmit = (event :FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo(inputValue.trim());
    setInputValue('');
  };

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
          ref={inputRef}
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
