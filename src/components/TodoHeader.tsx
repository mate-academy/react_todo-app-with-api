import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface Props {
  todos: Todo[];
  newTodo: string;
  setNewTodo: React.Dispatch<React.SetStateAction<string>>;
  handleAdd: (event: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  handleToggle: () => Promise<void>;
}

export const TodoHeader: React.FC<Props> = ({
  todos,
  handleAdd,
  newTodo,
  setNewTodo,
  isLoading,
  inputRef,
  handleToggle,
}) => {
  const hasTodos = todos.length > 0;
  const allCompleted = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {!isLoading && hasTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggle}
        />
      )}
      <form onSubmit={handleAdd}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={event => setNewTodo(event.target.value)}
          disabled={isLoading}
          ref={inputRef}
          autoFocus
        />
      </form>
    </header>
  );
};
