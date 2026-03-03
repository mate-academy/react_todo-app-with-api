import React, { useEffect } from 'react';
import clsx from 'clsx';

type Props = {
  newTodoQuery: string;
  onNewTodoQueryChange: (query: string) => void;
  shouldFocusNewTodo: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  isAllCompleted: boolean;
  onAddTodo: () => void;
  isAdding: boolean;
  isToggleBtn: boolean;
  onToggleAllStatus: () => void;
};

export const TodoHeader: React.FC<Props> = ({
  newTodoQuery,
  onNewTodoQueryChange,
  shouldFocusNewTodo,
  inputRef,
  isAllCompleted,
  onAddTodo,
  isAdding,
  isToggleBtn,
  onToggleAllStatus,
}) => {
  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef, shouldFocusNewTodo]);

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAddTodo();
    inputRef.current?.focus();
  };

  return (
    <header className="todoapp__header">
      {isToggleBtn && (
        <button
          type="button"
          className={clsx('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAllStatus}
        />
      )}

      <form onSubmit={onSubmitHandler}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoQuery}
          onChange={event => onNewTodoQueryChange(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
