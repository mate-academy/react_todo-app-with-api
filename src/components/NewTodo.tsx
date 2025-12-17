import React, { useState, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  onAdd: (title: string) => Promise<boolean>;
  disabled?: boolean;
  todos: Todo[];
  onToggleAll: (completed: boolean) => Promise<void>;
  inputRef?: React.RefObject<HTMLInputElement>;
  isLoading?: boolean;
};

export const NewTodo: React.FC<Props> = ({
  onAdd,
  disabled = false,
  todos,
  onToggleAll,
  inputRef,
  isLoading = false,
}) => {
  const [title, setTitle] = useState('');
  const [isTogglingAll, setIsTogglingAll] = useState(false);
  const localInputRef = useRef<HTMLInputElement>(null);

  const actualRef = inputRef || localInputRef;

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);
  const hasTodos = todos.length > 0;

  const handleToggleAll = async () => {
    setIsTogglingAll(true);
    await onToggleAll(!allCompleted);
    setIsTogglingAll(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const success = await onAdd(title);

    if (success) {
      setTitle('');
    }
  };

  return (
    <header className="todoapp__header">
      {!isLoading && hasTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
          disabled={disabled || isTogglingAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={actualRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={disabled || isTogglingAll}
          autoFocus
        />
      </form>
    </header>
  );
};
