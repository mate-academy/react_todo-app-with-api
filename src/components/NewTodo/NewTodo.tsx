import classNames from 'classnames';
import React, { RefObject } from 'react';

type Props = {
  newTodoField: RefObject<HTMLInputElement>,
  addNewTodo: () => void,
  isAdding: boolean,
  inputValue: string,
  setInputValue: (str: string) => void,
  addButton: boolean
  changeAllNotCompleted: () => void,
  completed: boolean,
};

export const NewTodo: React.FC<Props> = ({
  newTodoField,
  addNewTodo,
  isAdding,
  inputValue,
  setInputValue,
  addButton,
  changeAllNotCompleted,
  completed,
}) => {
  function submitForm(event: React.FormEvent) {
    event.preventDefault();

    addNewTodo();
  }

  return (
    <header className="todoapp__header">
      {addButton && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={
            classNames('todoapp__toggle-all', {
              active: completed,
            })
          }
          aria-label="x"
          onClick={() => changeAllNotCompleted()}
        />
      )}

      <form
        onSubmit={submitForm}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          style={{ outline: 0 }}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
