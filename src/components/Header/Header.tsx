import React, { FormEvent, useEffect, useRef } from 'react';
import classNames from 'classnames';

type Props = {
  onAddTodo: (title: string) => void,
  todoTitle: string,
  setTodoTitle: (todoTitle: string) => void,
  isBeingAdded: boolean,
  onStatusAll: (completed: boolean) => void,
  hasActive: boolean,
};

export const Header: React.FC<Props> = ({
  onAddTodo,
  todoTitle,
  setTodoTitle,
  isBeingAdded,
  onStatusAll,
  hasActive,
}) => {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    onAddTodo(todoTitle);
  };

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isBeingAdded]);

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: !hasActive },
        )}
        onClick={() => onStatusAll(!hasActive)}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(e) => setTodoTitle(e.target.value)}
          disabled={isBeingAdded}
        />
      </form>
    </header>
  );
};
