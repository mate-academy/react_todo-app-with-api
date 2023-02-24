import React, { useEffect, useState, useRef } from 'react';
import cn from 'classnames';

type Props = {
  hasTodos: number;
  hasActiveTodos: number;
  userId: number;
  handleAddTodo: (userId: number, title: string) => void;
  isInputDisabled: boolean;
  toggleTodosStatus: () => void;
};

export const Header: React.FC<Props> = React.memo(({
  hasTodos,
  hasActiveTodos,
  userId,
  handleAddTodo,
  isInputDisabled,
  toggleTodosStatus,
}) => {
  const [title, setTitle] = useState('');
  const [count, setCount] = useState(0);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (count) {
      inputRef.current?.focus();
    }
  }, [isInputDisabled]);

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleAddTodo(userId, title);
    setTitle('');
    setCount(prev => prev + 1);
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {!!hasTodos && (
        <button
          type="button"
          aria-label="toggle todos button"
          className={cn(
            'todoapp__toggle-all',
            { active: !hasActiveTodos },
          )}
          onClick={toggleTodosStatus}
        />
      )}

      <form
        onSubmit={handleOnSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          onChange={handleOnChange}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
});
