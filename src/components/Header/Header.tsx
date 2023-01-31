/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';

type Props = {
  onAddTodo: (event: React.FormEvent) => void
  todoTItle: string,
  setTodoTitle: (title: string) => void,
  isAdding: boolean,
  todosLeft: number,
  AllTodosLength: number,
  onToggleAll: () => void
};

export const Header: React.FC<Props> = ({
  onAddTodo,
  todoTItle,
  setTodoTitle,
  isAdding,
  todosLeft,
  AllTodosLength,
  onToggleAll,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  return (
    <header className="todoapp__header">
      {AllTodosLength !== 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: !todosLeft },
          )}
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTItle}
          onChange={(e) => setTodoTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
