import React, { useState } from 'react';
import classNames from 'classnames';
import { ErrorMessages } from '../types/ErrorMessages';

interface HeaderPropsType {
  handleAddTodo: (inputQuery: string) => void,
  showError: (errorMessage: ErrorMessages) => void,
  handleToggleAllTodos: () => void,
  isAllTodosCompleted: boolean,
}

export const Header: React.FC<HeaderPropsType> = ({
  handleAddTodo,
  showError,
  handleToggleAllTodos,
  isAllTodosCompleted,
}) => {
  const [inputTitle, setInputTitle] = useState('');

  const handleOnSubmit = () => {
    if (!inputTitle.trim()) {
      showError(ErrorMessages.ONTITLE);
    } else {
      handleAddTodo(inputTitle);
      setInputTitle('');
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: isAllTodosCompleted },
        )}
        aria-label="Add todo"
        onClick={handleToggleAllTodos}
      />
      <form
        onSubmit={handleOnSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputTitle}
          onChange={(event) => setInputTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
