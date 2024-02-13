import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
  isSubmitting: boolean,
  newTodoTitle: string,
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  todos: Todo[],
  toggleCompleteAll: () => void,
}

export const Header: React.FC<Props> = ({
  handleSubmit,
  isSubmitting,
  newTodoTitle,
  handleInputChange,
  todos,
  toggleCompleteAll,
}) => {
  const titleField = useRef<HTMLInputElement>(null);
  const isEveryTodoCompleted = todos.every(todo => todo.completed);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [todos]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        // className="todoapp__toggle-all active"
        className={classNames('todoapp__toggle-all', {
          active: isEveryTodoCompleted,
        })}
        data-cy="ToggleAllButton"
        aria-label="Add new todo"
        onClick={toggleCompleteAll}
      />

      <form
        onSubmit={handleSubmit}
      >
        <input
          ref={titleField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          name="titleInput"
          value={newTodoTitle}
          disabled={isSubmitting}
          onChange={handleInputChange}
        />
      </form>
    </header>
  );
};
