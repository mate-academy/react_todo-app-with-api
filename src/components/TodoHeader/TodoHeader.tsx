import React from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  onSubmit: (event: React.FormEvent) => void;
  onTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  isDisabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  todos: Todo[];
  toggleAllTodos: () => void | Promise<void>;
};

export const TodoHeader: React.FC<Props> = ({
  onSubmit,
  onTitleChange,
  title,
  isDisabled,
  inputRef,
  todos,
  toggleAllTodos,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllTodos}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          disabled={isDisabled}
          ref={inputRef}
          placeholder="What needs to be done?"
          value={title}
          onChange={onTitleChange}
        />
      </form>
    </header>
  );
};
