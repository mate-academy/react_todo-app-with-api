import React, { useState } from 'react';
import cn from 'classnames';

interface Props {
  newTodoField: React.RefObject<HTMLInputElement>;
  isAdding: boolean;
  addNewTodo: (title: string) => void;
  setErrorMessage: (message: string) => void;
  setHasError: (val: boolean) => void;
  changeAllToCompleted: () => void;
  isAllTodosCompleted: boolean;
}

export const NewTodoField: React.FC<Props> = ({
  newTodoField,
  isAdding,
  addNewTodo,
  setErrorMessage,
  setHasError,
  changeAllToCompleted,
  isAllTodosCompleted,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (event : React.FormEvent<HTMLElement>) => {
    event.preventDefault();

    if (title.trim() === '') {
      setHasError(true);
      setErrorMessage('Title can\'t be empty');

      return;
    }

    addNewTodo(title.trim());
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        // className="todoapp__toggle-all active"
        className={cn(
          'todoapp__toggle-all',
          { active: isAllTodosCompleted },
        )}
        onClick={changeAllToCompleted}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isAdding}
          value={title}
          onChange={(event => setTitle(event.target.value))}
        />
      </form>
    </header>
  );
};
