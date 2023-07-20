/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';

type Props = {
  todoTitle: string,
  handleTodoTitleChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void,
  isInputDisabled: boolean,
  handleFormSubmit: (
    param: string
  ) => void,
  setAllTodosComplete: () => void,
  isCompleted: boolean,
};

export const TodoAppHeader: React.FC<Props> = ({
  todoTitle,
  handleTodoTitleChange,
  isInputDisabled,
  handleFormSubmit,
  setAllTodosComplete,
  isCompleted,
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleFormSubmit(todoTitle);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          {
            active: isCompleted,
          },
        )}
        onClick={() => setAllTodosComplete()}
      />

      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleTodoTitleChange}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
