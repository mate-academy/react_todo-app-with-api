import React, { RefObject } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  newTitle: string;
  setNewTitle: (title: string) => void;
  addNewTodo: () => void;
  tempTodo: Todo | null;
  inputRef: RefObject<HTMLInputElement>;
  handleToggleAll: () => void;
  todos: Todo[];
  isLoading: boolean;
}

export const Header: React.FC<Props> = ({
  newTitle,
  setNewTitle,
  addNewTodo,
  tempTodo,
  inputRef,
  handleToggleAll,
  todos,
  isLoading,
}) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    addNewTodo();
  };

  return (
    <header className="todoapp__header">
      {!isLoading && todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.length > 0 && todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          name="todo"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          disabled={!!tempTodo}
          ref={inputRef}
          autoFocus
        />
      </form>
    </header>
  );
};
