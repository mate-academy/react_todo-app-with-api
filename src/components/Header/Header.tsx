import classNames from 'classnames';
import React, { useState } from 'react';

import { Todo } from '../../types/Todo';

type Props = {
  onHandleSubmit: React.FormEventHandler<HTMLFormElement>;
  onHandleInput: React.ChangeEventHandler<HTMLInputElement>,
  onHandleChangeTodo(data: object, id: number): void,
  newTodoField: React.RefObject<HTMLInputElement>,
  inputValue: string;
  isDisabled: boolean;
  todos: Todo[];
};

export const Header: React.FC<Props> = ({
  onHandleChangeTodo,
  onHandleSubmit,
  onHandleInput,
  newTodoField,
  inputValue,
  isDisabled,
  todos,
}) => {
  const [isToggled, setIsToggled] = useState(false);

  const toggleData = {
    completed: !isToggled,
  };

  const handleToggleButton = () => {
    setIsToggled(isCurrent => !isCurrent);

    todos.forEach(todo => onHandleChangeTodo(toggleData, todo.id));
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="toggle_button"
        id="toggle_button"
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: isToggled },
        )}
        onClick={handleToggleButton}
      />

      <form onSubmit={onHandleSubmit}>
        <input
          data-cy="editTodoField"
          type="text"
          ref={newTodoField}
          value={inputValue}
          disabled={isDisabled}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={onHandleInput}
        />
      </form>
    </header>
  );
};
