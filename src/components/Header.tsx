import React, { FormEvent, Ref } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  onSubmit: (e: FormEvent) => void;
  onChange: (value: string) => void;
  toggleTodoCompletion: (todoId: number) => void;
  todos: Todo[];
  inputRef: Ref<HTMLInputElement> | null;
  title: string;
  isLoading: boolean;
};

export const Header: React.FC<Props> = ({
  onSubmit,
  onChange,
  toggleTodoCompletion,
  todos,
  inputRef,
  title,
  isLoading,
}) => {
  const allTodosCompleted = todos.every(todo => todo.completed);
  const handleToggleAll = () => {
    todos.forEach(todo => toggleTodoCompletion(todo.id));
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          value={title}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={e => onChange(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
