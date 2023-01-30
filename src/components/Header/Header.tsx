import React, { memo, useEffect, useState } from 'react';
import cn from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessage';

interface Props {
  newTodoField: React.RefObject<HTMLInputElement>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setHasError: React.Dispatch<React.SetStateAction<boolean>>;
  isTodoAdding: boolean;
  createTodo: (newTitle: string) => Promise<void>;
  changeAllTodos: () => void;
  isAllTodosCompleted: boolean;
}

export const Header: React.FC<Props> = memo(({
  newTodoField,
  setErrorMessage,
  setHasError,
  isTodoAdding,
  createTodo,
  changeAllTodos,
  isAllTodosCompleted,
}) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    setHasError(false);
  }, []);

  const handleAddNewTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.length < 1 || !title.trim()) {
      setHasError(true);
      setErrorMessage(ErrorMessage.EmptyTitle);
    }

    if (title.trim()) {
      createTodo(title);
      setTitle('');
    }
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={cn(
          'todoapp__toggle-all',
          { active: isAllTodosCompleted },
        )}
        onClick={changeAllTodos}
      />

      <form onSubmit={handleAddNewTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isTodoAdding}
        />
      </form>
    </header>
  );
});
