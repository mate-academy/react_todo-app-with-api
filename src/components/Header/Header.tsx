import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  title: string;
  onChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  disabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  todos: Todo[];
  onToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  title,
  onChange,
  onSubmit,
  disabled,
  inputRef,
  todos,
  onToggleAll,
}) => (
  <header className="todoapp__header">
    {todos.length > 0 && (
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
      />
    )}

    <form onSubmit={onSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={event => onChange(event.target.value)}
        disabled={disabled}
        ref={inputRef}
        autoFocus
      />
    </form>
  </header>
);
