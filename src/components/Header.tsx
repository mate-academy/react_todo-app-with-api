import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  onAddTodo: (title: string) => Promise<void>;
  isSubmitting: boolean;
  todoFieldRef?: React.RefObject<HTMLInputElement> | undefined;
  isAllTodosCompleted?: boolean;
  onToggleAll?: () => void;
  activeTodosCount?: number;
}

export const Header: React.FC<Props> = ({
  todos,
  onAddTodo,
  isSubmitting,
  todoFieldRef,
  onToggleAll,
  isAllTodosCompleted = false,
}) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!isSubmitting) {
      todoFieldRef?.current?.focus();
    }
  }, [isSubmitting, todoFieldRef]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      onAddTodo('').catch(() => {});

      return;
    }

    try {
      await onAddTodo(trimmedTitle);
      setTitle('');
    } catch (error) {}
  }

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }


  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
          active: isAllTodosCompleted
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}
      

      <form onSubmit={handleSubmit}>
        <input
          ref={todoFieldRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          aria-label="New todo title"
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
