import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { ErrorMessages } from '../types/ErrorMessages';

interface HeaderPropsType {
  todos: Todo[],
  handleAddTodo: (inputQuery: string) => void,
  showError: (errorMessage: ErrorMessages) => void,
  toggleAllTodos: () => void,
}

export const Header: React.FC<HeaderPropsType> = ({
  todos,
  handleAddTodo,
  showError,
  toggleAllTodos,
}) => {
  const isActive = todos.filter(todo => !todo.completed);
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
          { active: isActive },
        )}
        aria-label="Add todo"
        onClick={() => toggleAllTodos()}
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
