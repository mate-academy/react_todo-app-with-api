/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import classNames from 'classnames';
import { TodoContext } from '../context/todoContext';

export const Header: React.FC = () => {
  const {
    title, addNewTitle, handleSubmit, itemsLeft, handleToggleTodos,
  }
    = useContext(TodoContext);

  const activeTasks = itemsLeft;

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: activeTasks > 0,
        })}
        onClick={handleToggleTodos}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => {
            addNewTitle(event.target.value);
          }}
        />
      </form>
    </header>
  );
};
