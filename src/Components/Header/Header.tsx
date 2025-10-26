import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  loadingTodoIds: number[];
  onAddTodo: (title: string) => void;
  onChangeCheckboxes: () => void;
}

export const Header: React.FC<Props> = ({
  todos,
  loadingTodoIds,
  onAddTodo,
  onChangeCheckboxes,
}) => {
  const [title, setTitle] = useState('');

  const newTodoFieldRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (newTodoFieldRef.current) {
      newTodoFieldRef.current.focus();
    }
  }, [loadingTodoIds]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedTitle = title.trim();

    try {
      await onAddTodo(trimmedTitle);

      setTitle('');
    } catch (error) {
      setTitle(trimmedTitle);
    }
  }

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(t => t.completed),
          })}
          onClick={onChangeCheckboxes}
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={loadingTodoIds.length > 0}
          ref={newTodoFieldRef}
        />
      </form>
    </header>
  );
};
