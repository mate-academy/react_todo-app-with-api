/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

type Props = {
  addTodo: () => void,
  updateAllTodoStatus: () => void
  newTodoField: React.RefObject<HTMLInputElement>
  newTodo: string,
  setNewTodo: React.Dispatch<React.SetStateAction<string>>
};

export const Header: React.FC<Props> = (props) => {
  const {
    addTodo,
    updateAllTodoStatus,
    newTodoField,
    newTodo,
    setNewTodo,
  } = props;

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
