import React, { useEffect, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import classNames from 'classnames';

interface Props {
  todos: Todo[];
  onAddTodo: (
    title: string,
    setIsSubmitting: (value: boolean) => void,
    resetForm: () => void,
  ) => void;
  setErrorMessage: (message: string | null) => void;
  toggleAllTodos: () => void;
  focusInputRef?: React.RefObject<HTMLInputElement>;
}

export const TodoForm: React.FC<Props> = ({
  todos,
  onAddTodo,
  setErrorMessage,
  toggleAllTodos,
}) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  const resetForm = () => {
    setTitle('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.trim() === '') {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsSubmitting(true);

    onAddTodo(title.trim(), setIsSubmitting, resetForm);
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          onClick={toggleAllTodos}
        />
      )}
      <form onSubmit={handleSubmit} className="todoapp__form">
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className={classNames('todoapp__new-todo', {
            disabled: isSubmitting,
          })}
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
