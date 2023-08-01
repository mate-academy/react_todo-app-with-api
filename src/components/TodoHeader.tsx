/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { TodoContext } from '../context/todoContext';
import { ErrorType } from '../enums';

export const TodoHeader: React.FC = () => {
  const {
    todos,
    loading,
    isAllCompletedTodos,
    onErrorHandler,
    onAddTodo,
    updateAllTodos,
  } = useContext(TodoContext);

  const [title, setTitle] = useState('');

  const handleChange = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title) {
      onErrorHandler(ErrorType.EmptyTitle);

      return;
    }

    const titleData = title;

    onAddTodo(titleData);
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompletedTodos,
          })}
          onClick={() => updateAllTodos()}
        />
      )}
      <form onSubmit={handleChange}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          disabled={loading}
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
