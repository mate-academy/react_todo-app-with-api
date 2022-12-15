/* eslint-disable jsx-a11y/control-has-associated-label */

import cn from 'classnames';
import React, { RefObject, useContext } from 'react';
import { ErrorType } from '../../types/ErrorType';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  newTodoField: RefObject<HTMLInputElement>;
  query: string;
  isDisabledInput: boolean;
  toggleButton?: boolean;
  onQueryChange: (value: string) => void;
  onErrorChange: (value: ErrorType) => void;
  onAddNewTodo: (value: Todo) => void;
  onToggleChange: () => void;
};

export const Header: React.FC<Props> = ({
  newTodoField,
  query,
  isDisabledInput,
  toggleButton,
  onQueryChange,
  onErrorChange,
  onAddNewTodo,
  onToggleChange,
}) => {
  const user = useContext(AuthContext);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!query.length) {
      onErrorChange(ErrorType.Title);

      setTimeout(() => {
        onErrorChange(ErrorType.None);
      }, 3000);

      return;
    }

    if (user) {
      onAddNewTodo({
        id: 0,
        userId: user.id,
        title: query,
        completed: false,
      });
    }

    onQueryChange('');
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        // className="todoapp__toggle-all active"
        className={cn('todoapp__toggle-all', { active: toggleButton })}
        onClick={() => onToggleChange()}
      />

      <form
        onSubmit={handleFormSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          disabled={isDisabledInput}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </form>
    </header>
  );
};
