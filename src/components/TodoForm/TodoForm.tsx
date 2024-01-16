import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  onError: (message: string) => void;
  onTodoAdd: (title: string) => Promise<void>;
  isActive: boolean;
  onTodoToggle: () => void;
};

export const TodoForm: React.FC<Props> = ({
  todos,
  onError,
  onTodoAdd,
  isActive,
  onTodoToggle,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleField = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [isSubmitting, todos.length]);

  const trimedTitle = todoTitle.trim();

  const handleSubmit = async (event: React.FormEvent) => {
    setIsSubmitting(true);
    event.preventDefault();

    if (!trimedTitle) {
      setTodoTitle('');
      onError('Title should not be empty');
      setIsSubmitting(false);

      return;
    }

    try {
      await onTodoAdd(trimedTitle);
      setTodoTitle('');
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          aria-label="toggle button"
          type="button"
          className={cn('todoapp__toggle-all', { active: isActive })}
          data-cy="ToggleAllButton"
          onClick={onTodoToggle}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleField}
          disabled={isSubmitting}
          value={todoTitle}
          onChange={(event) => {
            setTodoTitle(event.target.value);
          }}
        />
      </form>
    </header>
  );
};
