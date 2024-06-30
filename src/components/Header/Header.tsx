import React, { useEffect, useRef } from 'react';

export interface TodoHeaderProps {
  inputValue: string;
  isAddTodoEnabled: boolean;
  isEveryTodoCompleted: boolean;
  isToggleAllVisible: boolean;
  createTodo: () => void;
  setInputValue: (value: string) => void;
  toggleEnabled: (value: boolean) => void;
  handleToggleAll: () => void;
}

export const Header: React.FC<TodoHeaderProps> = ({
  inputValue,
  isAddTodoEnabled,
  isEveryTodoCompleted,
  isToggleAllVisible,
  createTodo,
  setInputValue,
  toggleEnabled,
  handleToggleAll,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.focus();
    }
  }, [isAddTodoEnabled]);

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleCreateTodo = (
    keyEvent: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (keyEvent.key === 'Enter') {
      keyEvent.preventDefault();
      toggleEnabled(false);
      createTodo();
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {isToggleAllVisible && (
        <button
          type="button"
          className={`todoapp__toggle-all ${isEveryTodoCompleted ? 'active' : ''} `}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleChangeInput}
          onKeyDown={handleCreateTodo}
          value={inputValue}
          disabled={!isAddTodoEnabled}
        />
      </form>
    </header>
  );
};
