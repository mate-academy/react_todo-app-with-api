import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

type Props = {
  onAddTodo: (title: string) => void;
  isDisabled: boolean;
  hasActiveTodo: boolean;
  onToggleAllStatus: () => void;
};

export const TodoForm: React.FC<Props> = React.memo(({
  onAddTodo,
  isDisabled,
  hasActiveTodo,
  onToggleAllStatus,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const firstRender = useRef<boolean>(true);
  const titleInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;

      return;
    }

    titleInput.current?.focus();
  }, [isDisabled]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const preparedTitle = todoTitle.trim();

    onAddTodo(preparedTitle);

    setTodoTitle('');
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="button"
        type="button"
        className={cn(
          'todoapp__toggle-all',
          { active: !hasActiveTodo },
        )}
        onClick={onToggleAllStatus}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleTitleChange}
          disabled={isDisabled}
          ref={titleInput}
        />
      </form>
    </header>
  );
});
