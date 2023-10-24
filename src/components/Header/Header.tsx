import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { TodosContext } from '../../TodosContext';

export const Header: React.FC = () => {
  const {
    todos,
    title,
    statusResponse,
    setTitle,
    addTodo,
    activeTodos,
    handleToggleAll,
  } = React.useContext(TodosContext);

  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [statusResponse, todos.length]);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: !activeTodos,
          })}
          data-cy="ToggleAllButton"
          aria-label="Toggle All"
          disabled={statusResponse}
          onClick={handleToggleAll}
        />
      )}

      <form
        method="post"
        onSubmit={addTodo}
      >
        <input
          data-cy="NewTodoField"
          ref={inputField}
          value={title}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={e => setTitle(e.target.value)}
          disabled={statusResponse}
        />
      </form>
    </header>
  );
};
