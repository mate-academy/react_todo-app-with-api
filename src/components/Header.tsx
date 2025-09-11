/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface HeaderProps {
  newTodoText: string;
  onNewTodoTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddTodo: (e: React.FormEvent<HTMLFormElement>) => void;
  newTitleRef: React.RefObject<HTMLInputElement>;
  isAddingTodo: boolean;
  todosList: Todo[];
  onToggleAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  newTodoText,
  onNewTodoTextChange,
  onAddTodo,
  newTitleRef,
  todosList,
  onToggleAll,
  isAddingTodo,
}) => {
  return (
    <header className="todoapp__header">
      {todosList.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todosList.every(t => t.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}
      <form onSubmit={onAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoText}
          onChange={onNewTodoTextChange}
          ref={newTitleRef}
          disabled={isAddingTodo}
        />
      </form>
    </header>
  );
};
