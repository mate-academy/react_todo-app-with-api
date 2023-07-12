import React, { useEffect, useRef } from 'react';
import cn from 'classnames';

interface Props {
  isTodosPresent: boolean;
  isAllTodosCompleted: boolean;
  toggleAllTodos: () => void;
  isAdding: boolean;
  formSubmitHandler: (event: React.FormEvent<HTMLFormElement>) => void
  handleNewTodoTitleChange: (
    event: React.ChangeEvent<HTMLInputElement>) => void;
  newTodoTitle: string;
}

export const TodoHeader: React.FC<Props> = ({
  isTodosPresent,
  isAllTodosCompleted,
  toggleAllTodos,
  isAdding,
  formSubmitHandler,
  handleNewTodoTitleChange,
  newTodoTitle,
}) => {
  const inputField = useRef<HTMLInputElement>(null);
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current && inputField.current) {
      inputField.current.focus();
    }

    if (isTodosPresent) {
      didMountRef.current = true;
    }
  }, [isAdding, isTodosPresent]);

  return (
    <header className="todoapp__header">
      {isTodosPresent && (
        <button
          type="button"
          className={cn(
            'todoapp__toggle-all',
            { active: isAllTodosCompleted },
          )}
          aria-label="Show todos"
          onClick={toggleAllTodos}
        />
      )}

      <form onSubmit={formSubmitHandler}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={handleNewTodoTitleChange}
          disabled={isAdding}
          ref={inputField}
        />
      </form>
    </header>
  );
};
