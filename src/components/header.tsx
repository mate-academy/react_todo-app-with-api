/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef } from 'react';

type Props = {
  addTodo: () => void,
  updateAllTodoStatus: () => void
  newTodo: string,
  setNewTodo: React.Dispatch<React.SetStateAction<string>>
};

export const Header: React.FC<Props> = (props) => {
  const {
    addTodo,
    updateAllTodoStatus,
    newTodo,
    setNewTodo,
  } = props;

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
        onClick={() => updateAllTodoStatus()}
      />

      <form onSubmit={(event) => {
        event.preventDefault();
        addTodo();
      }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={(event) => setNewTodo(event.target.value)}
          onBlur={() => addTodo()}
        />
      </form>
    </header>
  );
};
