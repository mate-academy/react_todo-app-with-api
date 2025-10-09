import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { ErrorMessages } from '../types/errorMessages';

type Props = {
  todos: Todo[];
  onErrorMessage: (error: ErrorMessages) => void;
  onAddTodo: (title: string) => Promise<void>;
  toggleTodosId: number[];
  toggleAllTodos: () => void;
};

export const Header: React.FC<Props> = ({
  todos,
  onErrorMessage,
  onAddTodo,
  toggleTodosId,
  toggleAllTodos,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [titleQuery, setTitleQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onErrorMessage(ErrorMessages.none);

    const trimmedTitleQuery = titleQuery.trim();

    if (!trimmedTitleQuery) {
      onErrorMessage(ErrorMessages.titleIsEmpty);
      setTitleQuery('');

      return;
    }

    setSubmitting(true);

    await onAddTodo(trimmedTitleQuery)
      .then(() => {
        setTitleQuery('');
        onErrorMessage(ErrorMessages.none);
      })
      .finally(() => setSubmitting(false));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleQuery(event.target.value);
  };

  useEffect(() => {
    if (!submitting && inputRef.current) {
      inputRef.current.focus();
    }
  }, [submitting, toggleTodosId]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllTodos}
        />
      )}

      <form onSubmit={handleFormSubmit}>
        <input
          value={titleQuery}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={submitting}
          ref={inputRef}
          onChange={handleInputChange}
        />
      </form>
    </header>
  );
};
