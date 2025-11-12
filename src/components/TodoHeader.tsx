import cn from 'classnames';
import React, { useEffect } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  newTodoTitle: string;
  onTitleChange: (value: string) => void;
  onSubmit: (value: React.FormEvent) => void;
  isDisabled: boolean;
  isAdding: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onToggleAll: () => Promise<void>;
  todos: Todo[];
};

export const TodoHeader: React.FC<Props> = ({
  newTodoTitle,
  onTitleChange,
  onSubmit,
  isDisabled,
  isAdding,
  inputRef,
  onToggleAll,
  todos,
}) => {
  useEffect(() => {
    inputRef.current?.focus();
  }, [isAdding, inputRef]);

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: allCompleted })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={element => onTitleChange(element.target.value.trimStart())}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
