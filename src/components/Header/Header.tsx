import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useTodos } from '../../Store';

export const Header: React.FC = () => {
  const {
    todos,
    todoTitle,
    handleSubmit,
    tempTodo,
    handleChange,
    isSubmitting,
    setTodos,
  } = useTodos();

  const [allCompleted, setAllCompleted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos]);

  useEffect(() => {
    const areAllCompleted = todos.every(todo => todo.completed);

    setAllCompleted(areAllCompleted);
  }, [todos]);

  const handleToggleAll = () => {
    const newCompletedStatus = !allCompleted;
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: newCompletedStatus,
    }));

    setTodos(updatedTodos);
    setAllCompleted(newCompletedStatus);
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: allCompleted,
        })}
        data-cy="ToggleAllButton"
        onClick={handleToggleAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={tempTodo ? tempTodo.title : todoTitle}
          onChange={handleChange}
          disabled={isSubmitting}
        />

        {isSubmitting && (
          <div data-cy="TodoLoader" className="modal overlay">
            <div
              className="
              modal-background
              has-background-white-ter
              is-active
            "
            />
            <div className="loader" />
          </div>
        )}
      </form>
    </header>
  );
};
