import React, { useEffect, useState } from 'react';
import cn from 'classnames';

interface Props {
  inputRef: React.RefObject<HTMLInputElement> | null;
  onAddTodo: (value: string) => Promise<boolean>;
  onToggleAllTodos: () => void;
  isLoading: boolean;
  isAllTodoCompleted: boolean;
  isTodoListNotEmpty: boolean;
}

export const TodoHeader: React.FC<Props> = ({
  inputRef,
  isAllTodoCompleted,
  isLoading,
  isTodoListNotEmpty,
  onAddTodo,
  onToggleAllTodos,
}) => {
  const [value, setValue] = useState('');

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = value.trim();

    const success = await onAddTodo(trimmedTitle);

    if (success) {
      setValue('');
    }
  };

  useEffect(() => {
    if (!isLoading) {
      inputRef?.current?.focus();
    }
  }, [inputRef, isLoading]);

  return (
    <header className="todoapp__header">
      {isTodoListNotEmpty && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: isAllTodoCompleted })}
          data-cy="ToggleAllButton"
          onClick={onToggleAllTodos}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={value}
          onChange={event => setValue(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
