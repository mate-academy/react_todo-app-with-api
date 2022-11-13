import React, { useRef } from 'react';
import classNames from 'classnames';
import { ErrorType } from '../types/ErrorType';

type Props = {
  newTitile: string;
  isAdding: boolean;
  setNewTitle: (value: string) => void;
  setErrors: (value: ErrorType) => void;
  addNewTodo: (value: string) => void;
  toggleAllTodos: () => void;
  allToggled: () => void;
};

export const TodoForm: React.FC<Props>
  = ({
    newTitile,
    setNewTitle,
    addNewTodo,
    setErrors,
    isAdding,
    toggleAllTodos,
    allToggled,
  }) => {
    const newTodoField = useRef<HTMLInputElement>(null);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (newTitile.trim().length === 0) {
        setErrors(ErrorType.EMPTYTITLE);

        return;
      }

      addNewTodo(newTitile);
      setNewTitle('');
    };

    return (
      <header className="todoapp__header">
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames('todoapp__toggle-all',
            { active: allToggled })}
          onClick={toggleAllTodos}
        />

        <form onSubmit={handleSubmit}>
          <input
            data-cy="NewTodoField"
            type="text"
            ref={newTodoField}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={newTitile}
            onChange={(event) => setNewTitle(event.target.value)}
            disabled={isAdding}
          />
        </form>
      </header>
    );
  };
