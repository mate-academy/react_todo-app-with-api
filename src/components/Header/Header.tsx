import React, { useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames';
import { TodosContext } from '../../TodosContext';

export const Header: React.FC = () => {
  const [title, setTitle] = React.useState('');

  const {
    todos,
    IsStatusResponse,
    addTodo,
    activeTodos,
    handlerToggleAll,
  } = React.useContext(TodosContext);

  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [IsStatusResponse, todos.length]);

  const handlerSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      addTodo(title, setTitle);
    },
    [addTodo, title],
  );

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: !activeTodos,
          })}
          data-cy="ToggleAllButton"
          aria-label="Toggle All"
          onClick={handlerToggleAll}
        />
      )}

      <form onSubmit={handlerSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          ref={input => input && input.focus()}
          disabled={IsStatusResponse}
        />
      </form>
    </header>
  );
};
