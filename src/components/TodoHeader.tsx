import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  onSubmit: (todo: Todo) => void
  todo?: Todo | null
  userId: number
  todos: Todo[]
  error: string
  request: boolean
  setError: (errorMessage: string) => void
  setTitle: (title: string) => void
  title: string
  setLoadingTodosIds: (tempTodoIds: number[]) => void
  onTogle: (todos: Todo[]) => void;
  isAllCompleted: boolean
};

export const TodoHeader: React.FC<Props> = ({
  onSubmit,
  todo,
  userId,
  todos,
  error,
  request,
  title,
  setError,
  setTitle,
  setLoadingTodosIds,
  isAllCompleted,
  onTogle,
}) => {
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setError('');

    if (!title.trim()) {
      setError('Title should not be empty');

      return;
    }

    const id = todo?.id || 0;
    const tempTodo: Omit<Todo, 'id'> = {
      title: title.trim(),
      completed: false,
      userId,
    };

    onSubmit({ id, ...tempTodo });
    setLoadingTodosIds([id]);
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos.length, request]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          aria-label="text"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={() => onTogle(todos)}
        />
      )}

      <form
        action="/api/posts"
        method="POST"
        onSubmit={handleSubmit}
      >
        <input
          disabled={request}
          data-cy="NewTodoField"
          type="text"
          className={classNames('todoapp__new-todo', {
            'is-danger': error,
          })}
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
