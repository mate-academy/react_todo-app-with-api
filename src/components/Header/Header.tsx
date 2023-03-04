import React, { useState } from 'react';
import cn from 'classnames';
import { ErrorMessages } from '../../types/ErrorMessages';

type Props = {
  addNewTodo: (newtodo: string) => void,
  addErrorMessage: (newMessage: ErrorMessages) => void,
  isSubmitButtonDisabled: boolean,
  isToogleButtonVisible: boolean,
  toggleStatusForAllTodos: () => void,
};

export const Header: React.FC<Props> = React.memo(({
  addNewTodo,
  addErrorMessage,
  isSubmitButtonDisabled,
  toggleStatusForAllTodos,
  isToogleButtonVisible,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!todoTitle) {
      addErrorMessage(ErrorMessages.TITLE);
    }

    addErrorMessage(ErrorMessages.NONE);
    addNewTodo(todoTitle.trim());
    setTodoTitle('');
  };

  const handleToggle = () => {
    toggleStatusForAllTodos();
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: isToogleButtonVisible,
        })}
        onClick={handleToggle}
        aria-label="Toogle all as completed"
      />

      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.target.value)}
          disabled={isSubmitButtonDisabled}
        />
      </form>
    </header>
  );
});
