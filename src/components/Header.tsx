import React, { useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  newTodoTitle: string;
  setNewTodoTitle: React.Dispatch<React.SetStateAction<string>>;
  onAdd: (event: React.FormEvent) => Promise<void>;
  isAdding: boolean;
  isLoading: boolean;
  todoCount: number;
  todos: Todo[];
  handleToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  newTodoTitle,
  setNewTodoTitle,
  onAdd,
  isAdding,
  isLoading,
  todoCount,
  todos,
  handleToggleAll,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  useEffect(() => {
    if (!isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [todoCount, isAdding]);

  return (
    <header className="todoapp__header">
      {!isLoading && todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
          disabled={todos.length === 0}
        />
      )}

      <form onSubmit={onAdd}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={event => setNewTodoTitle(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
