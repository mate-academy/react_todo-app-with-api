/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';

import '../../styles/header.scss';
import { Todo } from '../../types/Todo';

interface Props {
  onSubmit: (event: React.FormEvent) => void,
  todos: Todo[],
  inputValue: string,
  changeInputValue: (el: string) => void,
  isLoading: boolean,
  todoInputRef: React.RefObject<HTMLInputElement>,
  toggleAllAction: () => void,
  hasAllTodosCompleted: boolean,
}

export const Header: React.FC<Props> = ({
  onSubmit,
  todos,
  inputValue,
  changeInputValue,
  isLoading,
  todoInputRef,
  toggleAllAction,
  hasAllTodosCompleted,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn(
            'todoapp__toggle-all',
            { active: hasAllTodosCompleted },
          )}
          data-cy="ToggleAllButton"
          onClick={toggleAllAction}
        />
      )}

      <form onSubmit={event => onSubmit(event)}>
        <input
          ref={todoInputRef}
          data-cy="NewTodoField"
          type="text"
          className={cn(
            'todoapp__new-todo',
            { 'disabled-input': isLoading },
          )}
          value={inputValue}
          onChange={event => changeInputValue(event.target.value)}
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
