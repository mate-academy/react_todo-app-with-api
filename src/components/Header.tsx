import React, { FormEventHandler, useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface Props {
  handleSubmit: FormEventHandler<HTMLFormElement> | undefined;
  newTodo: string;
  setNewTodo: (value: string) => void;
  isInputDisabled: boolean;
  todos: Todo[];
  onToggleAll: () => void;
  areActiveTodos: boolean;
}

export const Header: React.FC<Props> = ({
  handleSubmit,
  newTodo,
  setNewTodo,
  isInputDisabled,
  todos,
  onToggleAll,
  areActiveTodos,
}) => {
  const newTodoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoInputRef.current) {
      newTodoInputRef.current.focus();
    }
  }, [todos, isInputDisabled]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: areActiveTodos,
        })}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
      />
      <form onSubmit={handleSubmit}>
        <input
          ref={newTodoInputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
