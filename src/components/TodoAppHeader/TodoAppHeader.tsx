import React, { useEffect } from 'react';
import { ErrorText } from '../../types/ErrorText';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  onAddNewTodo: (_: string) => void;
  onError: (_: ErrorText) => void;
  isPosting: boolean;
  title: string;
  setTitle: (_: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  onTodoCheck: (_: Todo) => void;
};

export const TodoAppHeader: React.FC<Props> = ({
  todos,
  onAddNewTodo,
  onError,
  isPosting,
  title,
  setTitle,
  inputRef,
  onTodoCheck,
}) => {
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleTitleFormSubmit = () => {
    const trimmedTitle = title.trim();

    if (trimmedTitle) {
      onAddNewTodo(trimmedTitle);
    } else {
      onError(ErrorText.Title);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (event.key === 'Enter') {
      handleTitleFormSubmit();
    }
  };

  const handleToggleAllClick = () => {
    if (todos.every(todo => todo.completed)) {
      todos.forEach(todo => onTodoCheck(todo));
    }

    todos.forEach(todo => {
      if (!todo.completed) {
        onTodoCheck(todo);
      }
    });
  };

  useEffect(() => {
    inputRef.current?.focus();
  });

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAllClick}
        />
      )}

      <form onSubmit={event => event.preventDefault()}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onKeyDown={handleKeyDown}
          onChange={handleTitleChange}
          disabled={isPosting}
        />
      </form>
    </header>
  );
};
