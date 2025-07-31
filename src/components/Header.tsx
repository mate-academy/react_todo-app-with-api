import cn from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  allTodosAreActive: boolean;
  title: string;
  setTitle: (title: string) => void;
  addTodo: () => void;
  loading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  toggleAllTodos: (todo: Todo[]) => void;
  todos: Todo[];
};

export const Header: React.FC<Props> = ({
  allTodosAreActive,
  title,
  setTitle,
  addTodo,
  loading,
  inputRef,
  toggleAllTodos,
  todos,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTodo();
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && !loading && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: allTodosAreActive })}
          data-cy="ToggleAllButton"
          onClick={() => toggleAllTodos(todos)}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          disabled={loading}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          autoFocus
          ref={inputRef}
        />
      </form>
    </header>
  );
};
