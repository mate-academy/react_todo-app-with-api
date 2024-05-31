import React, { FormEvent } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  inputRef: React.RefObject<HTMLInputElement>;
  handleAddingTodo: (event: FormEvent<HTMLFormElement>) => void;
  title: string;
  handleTypingTodo: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleTogglingAllTodos: () => void;
};

export const Header: React.FC<Props> = ({
  todos,
  inputRef,
  handleAddingTodo,
  title,
  handleTypingTodo,
  handleTogglingAllTodos,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: activeTodos.length === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={handleTogglingAllTodos}
        />
      )}

      <form onSubmit={handleAddingTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          onChange={handleTypingTodo}
        />
      </form>
    </header>
  );
};
