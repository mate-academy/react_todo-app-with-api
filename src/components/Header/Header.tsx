import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todosLength: number;
  userId: number;
  onSubmit: (v: Todo) => Promise<void>;
  onError: (v: string) => void;
  onTemp: (v: Todo | null) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isCompleted: boolean;
  onCompleteAll: () => void;
};

export const Header: React.FC<Props> = ({
  todosLength,
  userId,
  onSubmit,
  onError = () => {},
  onTemp,
  inputRef,
  isCompleted,
  onCompleteAll,
}) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const reset = () => {
    setTitle('');
  };

  const submitTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normilizeTitle = title.toLowerCase().trim();

    if (!normilizeTitle) {
      onError('Title should not be empty');

      return;
    }

    const newTempTodo = {
      id: 0,
      userId,
      title: title.trim(),
      completed: false,
    };

    onTemp(newTempTodo);

    setIsSubmitting(true);

    onSubmit(newTempTodo)
      .then(() => {
        reset();

        onTemp(null);
      })
      .finally(() => {
        setIsSubmitting(false);

        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 0);
      });
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}

      {!!todosLength && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onCompleteAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={submitTodo} onReset={reset}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
