import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { USER_ID } from '../api/todoApi';
import { ErrorMessage } from '../types/ErorrMessage';

type Props = {
  todos: Todo[];
  loading: boolean;
  loaded: boolean;
  onAdd: ({ title, userId, completed }: Omit<Todo, 'id'>) => void;
  onError: (errorMessage: ErrorMessage | '') => void;
  onUpdate: (isPressed: boolean) => void;
  onClear: (state: boolean) => void;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  loading,
  loaded,
  onAdd,
  onError,
  onUpdate,
  onClear,
}) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const isAllCopleted = todos.every(todo => todo.completed);

  useEffect(() => {
    if (loaded) {
      inputRef.current?.focus();
      onClear(false);
    }
  }, [loaded]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onError('');

    if (value.trim() === '') {
      onError(ErrorMessage.TITLE);
      setTimeout(() => onError(''), 3000);

      return;
    }

    try {
      await onAdd({
        title: value.trim(),
        userId: Number(USER_ID),
        completed: false,
      });

      setValue('');
    } catch (error) {
      throw error;
    }
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCopleted,
          })}
          data-cy="ToggleAllButton"
          onClick={() => onUpdate(true)}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={loading}
          value={value}
          onChange={e => setValue(e.target.value)}
        />
      </form>
    </header>
  );
};
