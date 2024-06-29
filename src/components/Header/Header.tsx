import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  tempTodo: Todo | null;
  inputText: string;
  activeTodosQTY: number;
  allTodosQTY: number;
  onSubmit: (event: React.FormEvent) => void;
  handleInputText: (newTitle: string) => void;
  handleToggleAll: () => void;
}

export const Header: React.FC<Props> = ({
  onSubmit,
  handleInputText,
  handleToggleAll,
  inputText,
  activeTodosQTY,
  tempTodo,
  allTodosQTY,
}) => {
  const focusField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusField.current) {
      focusField.current.focus();
    }
  }, [tempTodo]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {allTodosQTY !== 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: activeTodosQTY === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          value={inputText}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={focusField}
          disabled={!!tempTodo}
          onChange={event => handleInputText(event.target.value)}
        />
      </form>
    </header>
  );
};
