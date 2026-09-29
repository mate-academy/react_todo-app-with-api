import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Errors } from '../../types/Errors';

type Props = {
  todos: Todo[];
  onAdd: (title: string) => Promise<unknown>;
  onErrorMessage: (errorMessage: Errors) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  onToggle: (todo: Todo) => Promise<void>;
};

export const NewTodo: React.FC<Props> = ({
  todos,
  onAdd,
  onErrorMessage,
  inputRef,
  onToggle,
}) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isSubmitting) {
      inputRef.current?.focus();
    }
  }, [isSubmitting, inputRef]);

  function handlerSubmitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      onErrorMessage(Errors.EmptyTitle);

      return;
    }

    setIsSubmitting(true);

    onAdd(trimmedTitle)
      .then(() => setTitle(''))
      .catch(() => {
        onErrorMessage(Errors.Add);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  function handleToggleAll() {
    const areAllCompleted = todos.every(todo => todo.completed);
    const targetStatus = !areAllCompleted;

    todos
      .filter(todo => todo.completed !== targetStatus)
      .forEach(todo => onToggle(todo));
  }

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handlerSubmitForm}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
