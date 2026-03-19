import React, { FormEvent } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  todoTitle: string;
  setTodoTitle: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  handleSubmit: (e: FormEvent) => void;
  isSaving: boolean;
  onToggleAll: () => Promise<void>;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  todoTitle,
  setTodoTitle,
  inputRef,
  handleSubmit,
  onToggleAll,
  isSaving,
}) => {
  const isAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={e => setTodoTitle(e.target.value)}
          disabled={isSaving}
        />
      </form>
    </header>
  );
};
