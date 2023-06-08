import React, { useState } from 'react';

type Props = {
  addNewTodo: (newTodo: string) => void;
  selectAllCompletedTodos: () => void;
  isInputDisabled: boolean;
  todosLength: number;
  isCompletedTodos: boolean;

};

export const FormTodo: React.FC<Props> = (
  {
    addNewTodo, isInputDisabled,
    selectAllCompletedTodos,
    todosLength,
    isCompletedTodos,
  },
) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addNewTodo(inputValue);
    setInputValue('');
  };

  const handlerButton = () => {
    selectAllCompletedTodos();
  };

  const isBtnDisabled = todosLength > 0;
  const isBntActive = isCompletedTodos
    ? 'todoapp__toggle-all active'
    : 'todoapp__toggle-all';

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={isBntActive}
        aria-hidden="true"
        onClick={() => handlerButton()}
        style={{ visibility: isBtnDisabled ? 'visible' : 'hidden' }}
      />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={handleInputForm}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
