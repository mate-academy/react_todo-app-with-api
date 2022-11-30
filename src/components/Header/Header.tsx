import React, { ChangeEvent } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  inputValue: string;
  newTodoField: React.RefObject<HTMLInputElement>;
  isExist: boolean;
  inputDisabled: boolean;
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleAddTodo: (event: ChangeEvent<HTMLFormElement>) => Promise<void>;
  todos: Todo[];
  handleToggleAllButton: () => Promise<void>;
};

export const Header: React.FC<Props> = ({
  inputValue,
  newTodoField,
  isExist,
  inputDisabled,
  handleInputChange,
  handleAddTodo,
  todos,
  handleToggleAllButton,
}) => {
  const allTodosAreCompleted = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {isExist && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames('todoapp__toggle-all',
            { active: allTodosAreCompleted })}
          onClick={handleToggleAllButton}
          aria-label="toggleAll"
        />
      )}

      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          value={inputValue}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleInputChange}
          disabled={inputDisabled}
        />
      </form>
    </header>
  );
};
