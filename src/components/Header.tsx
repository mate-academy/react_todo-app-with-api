import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import { NewTodo } from './NewTodo';
import type { ErrorMessageType } from '../types/ErrorMessage';
import type { Todo } from '../types/Todo';

type Props = {
  isAllCompleted: boolean;
  isSubmitting: boolean;
  todos: Todo[];
  onAdd: (title: string) => Promise<boolean>;
  onError: (error: ErrorMessageType | null) => void;
  onToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  isAllCompleted,
  isSubmitting,
  todos,
  onAdd,
  onError,
  onToggleAll,
}) => {
  const newTodoFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    newTodoFieldRef.current?.focus();
  }, [isSubmitting, todos]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          type="button"
          data-cy="ToggleAllButton"
          aria-label="Toggle all todos"
          className={cn('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          onClick={onToggleAll}
        />
      )}

      <NewTodo
        isSubmitting={isSubmitting}
        inputRef={newTodoFieldRef}
        onAdd={onAdd}
        onError={onError}
      />
    </header>
  );
};
