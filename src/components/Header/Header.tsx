import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  todos: Todo[];
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  onAdd: (title: string) => Promise<void>;
  errorMessage: ErrorMessage;
  setErrorMessage: (error: ErrorMessage) => void;
  isInputDisabled: boolean;
  isTodoLoading: boolean;
  toggleAllTodos: () => void;
};

export const Header: React.FC<Props> = props => {
  const {
    todos,
    onAdd,
    errorMessage,
    setErrorMessage,
    inputRef,
    isInputDisabled,
    isTodoLoading,
    toggleAllTodos,
  } = props;

  const allTodoCompleted = todos.every(todo => todo.completed);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef, isTodoLoading, onAdd, todos]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (errorMessage !== ErrorMessage.Default) {
      setErrorMessage(ErrorMessage.Default);
    }

    if (!title.trim()) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    onAdd(title)
      .then(() => setTitle(''))
      .catch(() => {});
  }

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: allTodoCompleted })}
          data-cy="ToggleAllButton"
          onClick={toggleAllTodos}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isInputDisabled || isTodoLoading}
          autoFocus
          ref={inputRef}
        />
      </form>
    </header>
  );
};
