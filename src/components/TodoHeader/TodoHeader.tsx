import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  title: string;
  setTitle: (title: string) => void;
  onLoading: boolean;
  toggleAllTodos: () => Promise<void>;
  handleCreateTodo: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef: { current: null | HTMLInputElement };
};

export const TodoHeader: React.FC<Props> = React.memo(function TodoHeader({
  todos,
  title,
  setTitle,
  onLoading,
  toggleAllTodos,
  handleCreateTodo,
  inputRef,
}) {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.length > 0 && todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllTodos}
        />
      )}

      <form onSubmit={e => e.preventDefault()}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          onKeyDown={handleCreateTodo}
          ref={inputRef}
          disabled={onLoading}
        />
      </form>
    </header>
  );
});
