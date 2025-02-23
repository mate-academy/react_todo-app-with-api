import classNames from 'classnames';
import React, { FormEvent, useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { ErrorMessages } from '../enum/ErrorMassages';

interface Props {
  onAdd: (newTodo: Todo) => Promise<void>;
  showError: (message: ErrorMessages) => void;
  isLoading: boolean;
  todos: Todo[];
  inputRef: React.RefObject<HTMLInputElement>;
  onToggleAll: () => void;
}

export const Header: React.FC<Props> = ({
  onAdd,
  showError,
  isLoading,
  todos,
  inputRef,
  onToggleAll,
}) => {
  const [title, setTitle] = useState<string>('');
  const trimmedTitle = title.trim();
  const allCompletedTodos = todos.every(todo => todo.completed);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trimmedTitle) {
      showError(ErrorMessages.Title);
      inputRef.current?.focus();

      return;
    }

    try {
      await onAdd({
        id: 0,
        userId: 1380,
        title: trimmedTitle,
        completed: false,
      });
      setTitle('');
    } catch (error) {
      showError(ErrorMessages.Add);
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompletedTodos,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        ></button>
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          ref={inputRef}
          onChange={event => setTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
