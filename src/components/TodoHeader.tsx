import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface TodoHeaderProps {
  todos: Todo[];
  newTitle: string;
  tempTodo: Todo | null;
  inputRef: React.RefObject<HTMLInputElement>;
  onToggleAll: () => void;
  onSubmit: (event: React.FormEvent) => void;
  onNewTitleChange: (title: string) => void;
}

export const TodoHeader: React.FC<TodoHeaderProps> = ({
  todos,
  newTitle,
  tempTodo,
  inputRef,
  onToggleAll,
  onSubmit,
  onNewTitleChange,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          data-cy="ToggleAllButton"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={e => onNewTitleChange(e.target.value)}
          disabled={tempTodo !== null}
          autoFocus
        />
      </form>
    </header>
  );
};
