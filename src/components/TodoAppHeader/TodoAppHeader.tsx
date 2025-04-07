import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

type Props = {
  todosLength: number;
  hasAllCompleted: boolean;
  onAdd: (newTodoTitle: string) => Promise<void>;
  onToggleAll: (completeAll: boolean) => void;
  onError: () => void;
};

export const TodoAppHeader: React.FC<Props> = ({
  todosLength,
  hasAllCompleted,
  onAdd,
  onToggleAll,
  onError,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const focusOnInput = useCallback(() => inputRef.current?.focus(), []);

  const toggleAll = () => onToggleAll(!hasAllCompleted);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newtitle = newTodoTitle.trim();

    if (!newtitle) {
      onError();
      focusOnInput();

      return;
    }

    try {
      setIsSubmitting(true);
      await onAdd(newtitle);
      setNewTodoTitle('');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    focusOnInput();
  }, [todosLength, isSubmitting, focusOnInput]);

  return (
    <header className="todoapp__header">
      {todosLength > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: hasAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
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
          onChange={onInputChange}
          disabled={isSubmitting}
          autoFocus
        />
      </form>
    </header>
  );
};
