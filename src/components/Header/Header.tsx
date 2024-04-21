import React, { useContext, useEffect, useRef, useState } from 'react';
import { todosContext } from '../../Store';
import classNames from 'classnames';
import { item, items } from '../../utils/utils';

export const Header: React.FC = () => {
  const [state, setters] = useContext(todosContext);
  const [title, setTitle] = useState('');
  const titleFild = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleFild.current && !state.selectedTodo) {
      titleFild.current.focus();
    }
  }, [state.selectedTodo, state.updatedAt, state.loading]);

  const allTodosAreCompleted =
    items.completed(state.todos).length === state.todos.length;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    item.handleAdd(title, state, setters, setTitle);
  }

  return (
    <header className="todoapp__header">
      {state.todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allTodosAreCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={() => items.toggleAll(state, setters)}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          ref={titleFild}
          disabled={state.loading}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
