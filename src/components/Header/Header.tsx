import React, { useContext, useEffect, useRef, useState } from 'react';
import { todosContext } from '../../Store';
import classNames from 'classnames';
import { errorText } from '../../constants';
import { completedTodos, uncompletedTodos } from '../../utils/utils';
import { handleAdd } from '../../utils/handleAdd';
import { handleUpdate } from '../../utils/handleUpdate';

export const Header: React.FC = () => {
  const [state, setters] = useContext(todosContext);
  const [title, setTitle] = useState('');
  const titleFild = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleFild.current && !state.selectedTodo) {
      titleFild.current.focus();
    }
  }, [state.selectedTodo, state.todos, state.updatedAt, state.loading]);

  const allTodosAreCompleted =
    completedTodos(state.todos).length === state.todos.length;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newTitle = title.trim();

    if (!newTitle) {
      setters.setErrorMessage(errorText.emptyTitle);

      return;
    }

    if (!state.loading) {
      handleAdd(newTitle, setters).then(() => setTitle(''));
    }
  }

  function toggleAll() {
    if (uncompletedTodos(state.todos).length > 0) {
      uncompletedTodos(state.todos).map(todo => {
        return handleUpdate(todo, !todo.completed, setters);
      });
    }

    if (uncompletedTodos(state.todos).length === 0 && state.todos.length > 0) {
      state.todos.map(todo => {
        return handleUpdate(todo, !todo.completed, setters);
      });
    }
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
          onClick={() => toggleAll()}
        />
      )}

      <form onSubmit={handleSubmit}>
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
