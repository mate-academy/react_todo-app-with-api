import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';
type Props = {
  todos: Todo[];
  newTitle: string;
  isAdding: boolean;
  isLoadingTodos: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  toggleAll: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onTitleChange: (value: string) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  newTitle,
  isAdding,
  isLoadingTodos,
  inputRef,
  toggleAll,
  onSubmit,
  onTitleChange,
}) => {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTitleChange(e.target.value);
  };

  return (
    <>
      <header className="todoapp__header">
        {!isLoadingTodos && todos.length > 0 && (
          <button
            type="button"
            onClick={toggleAll}
            className={classNames('todoapp__toggle-all', {
              active: todos.length > 0 && todos.every(todo => todo.completed),
            })}
            data-cy="ToggleAllButton"
          />
        )}

        <form onSubmit={onSubmit}>
          <input
            ref={inputRef}
            disabled={isAdding}
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={newTitle}
            onChange={handleTitleChange}
          />
        </form>
      </header>
    </>
  );
};
