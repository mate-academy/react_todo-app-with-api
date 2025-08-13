import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';
import { ErrorMessage } from '../../types/ErrorMessage';
import classNames from 'classnames';

type Props = {
  onAdd: (todo: Todo) => Promise<void>;
  onError: (error: ErrorMessage) => void;
  onFocus: React.RefObject<HTMLInputElement>;
  isInput: boolean;
  isComleted: boolean;
  changeAllComplete: () => void;
  todos: Todo[];
};

export const TodoHeader: React.FC<Props> = ({
  onAdd,
  onError,
  onFocus,
  isInput,
  isComleted,
  changeAllComplete,
  todos,
}) => {
  const [query, setQuery] = useState('');

  const handleSetTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const crearQuery = query.trim();

    if (crearQuery.length === 0) {
      onError(ErrorMessage.EmptyTitleError);

      return;
    }

    onAdd({ id: 0, userId: USER_ID, title: crearQuery, completed: false }).then(
      () => setQuery(''),
    );
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length !== 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isComleted,
          })}
          data-cy="ToggleAllButton"
          onClick={changeAllComplete}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSetTodo}>
        <input
          data-cy="NewTodoField"
          ref={onFocus}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => setQuery(event.target.value)}
          disabled={isInput}
        />
      </form>
    </header>
  );
};
