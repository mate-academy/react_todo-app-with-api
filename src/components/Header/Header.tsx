import React, { FormEvent, RefObject } from 'react';
import classNames from 'classnames';

type Props = {
  todosCount: number;
  allTodosCompleted: boolean;
  newTitle: string;
  isAdding: boolean;
  newTodoField: RefObject<HTMLInputElement>;
  onNewTitleChange: (title: string) => void;
  onCreateTodo: (event: FormEvent) => void;
  onToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  todosCount,
  allTodosCompleted,
  newTitle,
  isAdding,
  newTodoField,
  onNewTitleChange,
  onCreateTodo,
  onToggleAll,
}) => (
  <header className="todoapp__header">
    {todosCount > 0 && (
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: allTodosCompleted,
        })}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
      />
    )}

    <form onSubmit={onCreateTodo}>
      <input
        ref={newTodoField}
        type="text"
        className="todoapp__new-todo"
        data-cy="NewTodoField"
        placeholder="What needs to be done?"
        value={newTitle}
        disabled={isAdding}
        onChange={event => onNewTitleChange(event.target.value)}
      />
    </form>
  </header>
);
