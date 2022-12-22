/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';

interface Props {
  newTodoField: React.RefObject<HTMLInputElement>,
  completedTodos: boolean,
  onTodoTitle: (title: string) => void,
  onErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  inputDisabled: boolean,
  onUpdateAllTodoStatus: () => Promise<void>;
}

export const Header: React.FC<Props> = React.memo(({
  newTodoField,
  completedTodos,
  onTodoTitle,
  onErrorMessage,
  inputDisabled,
  onUpdateAllTodoStatus,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const handleFormSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (newTodoTitle.trim()) {
        onTodoTitle(newTodoTitle);
        setNewTodoTitle('');
      }
    } catch {
      onErrorMessage('Unable to add empty todo');
      setNewTodoTitle('');
    }
  }, [newTodoTitle]);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={classNames('todoapp__toggle-all',
          { active: completedTodos })}
        onClick={onUpdateAllTodoStatus}
      />

      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(event) => setNewTodoTitle(event.target.value)}
          disabled={inputDisabled}
        />
      </form>
    </header>
  );
});
