import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';

type Props = {
  onSubmit: (todo: Todo) => void;
  todos: Todo[];
  error: string;
  setError: (error: string) => void;
  setInputDisabled: () => void;
  inputDisabled: boolean;
  inputTitle: string;
  handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  toggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  todos,
  onSubmit,
  setError,
  setInputDisabled,
  inputDisabled,
  inputTitle,
  handleTitleChange,
  toggleAll,
}) => {
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputDisabled && titleField.current) {
      titleField.current.focus();
    }
  }, [inputDisabled]);

  const handleOnSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setInputDisabled();

    onSubmit({
      id: 0,
      userId: USER_ID,
      title: inputTitle,
      completed: false,
    });
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.filter(todo => !todo.completed).length === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleOnSubmit}>
        <input
          ref={titleField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputTitle}
          onChange={handleTitleChange}
          disabled={inputDisabled}
        />
      </form>
    </header>
  );
};
