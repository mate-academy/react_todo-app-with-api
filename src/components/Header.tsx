import React, { useEffect } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  onAdd: (title: string) => void;
  todos: Todo[];
  isLoading: boolean;
  disabled: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  onToggleAll: (value: boolean) => void;
};

export const Header: React.FC<Props> = ({
  onAdd,
  todos,
  isLoading,
  disabled,
  inputValue,
  setInputValue,
  inputRef,
  onToggleAll,
}) => {
  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled, inputRef]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(inputValue);

    inputRef.current?.focus();
  };

  const handleToggleAll = () => {
    const alreadyCompletedAll =
      todos.length > 0 && todos.every(todo => todo.completed);

    onToggleAll(!alreadyCompletedAll);
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {!isLoading && todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${todos.every(todo => todo.completed) && `active`}`}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          disabled={disabled}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
