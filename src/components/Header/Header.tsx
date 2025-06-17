import React, { useEffect } from 'react';
import { ErrorType } from '../../types/ErrorType';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  handleAddTodo: (title: string) => void;
  handleError: (errorAnswer: ErrorType | null) => void;
  error: ErrorType | null;
  tempTodo: Todo | null;
  title: string;
  onTitleChange: (value: string) => void;

  inputRef: React.RefObject<HTMLInputElement> | null;

  handleToggleAll: () => void;
  isAllTodosNotComplited: boolean;
  allTodos: Todo[];
};

export const Header: React.FC<Props> = ({
  handleAddTodo,
  handleError,
  tempTodo,
  title,
  onTitleChange,
  inputRef,

  handleToggleAll,
  isAllTodosNotComplited,

  allTodos,
}) => {
  useEffect(() => {
    if (!tempTodo && inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [tempTodo, inputRef]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.trim().length === 0) {
      handleError('Title should not be empty');

      return;
    }

    handleAddTodo(title.trim());
  };

  return (
    <header className="todoapp__header">
      {allTodos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllTodosNotComplited,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          value={title}
          onChange={event => onTitleChange(event.target.value)}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={tempTodo !== null}
        />
      </form>
    </header>
  );
};
