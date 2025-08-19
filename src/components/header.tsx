import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

type Props = {
  hasTodos: boolean;
  allCompleted: boolean;
  onToggleAll: () => void;
  onAddTodo: (title: string) => Promise<boolean>;
  inputRef: React.RefObject<HTMLInputElement>;
  disabled: boolean;
};

export const Header: React.FC<Props> = ({
  hasTodos,
  allCompleted,
  onToggleAll,
  onAddTodo,
  inputRef,
  disabled,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const wasDisabled = useRef(disabled);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await onAddTodo(newTitle);

    // очищаем поле только при успехе
    if (ok) {
      setNewTitle('');
    }
  };

  // когда disabled меняется true → false (после ответа) → вернуть фокус
  useEffect(() => {
    if (wasDisabled.current && !disabled) {
      inputRef.current?.focus();
    }

    wasDisabled.current = disabled;
  }, [disabled, inputRef]);

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
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
          onChange={e => setNewTitle(e.target.value)}
          disabled={disabled}
        />
      </form>
    </header>
  );
};
