import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';

type Props = {
  isAllCompleted: boolean;
  onAdd: (title: string) => Promise<boolean>;
  isAdding: boolean;
  focusTrigger: number;
  onToggleAll?: () => void;
  hasTodos: boolean;
};

export const TodoHeader: React.FC<Props> = ({
  isAllCompleted,
  onAdd,
  isAdding,
  focusTrigger,
  onToggleAll,
  hasTodos,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding, focusTrigger]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const isAdded = await onAdd(newTitle);

    if (isAdded) {
      setNewTitle('');
    }
  };

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={event => setNewTitle(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
