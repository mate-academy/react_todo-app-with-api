/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useContext, useEffect } from 'react';
import { ErrorValues } from '../../types/ErrorValues';
import { Todo } from '../../types/Todo';
import { LoaderContext } from '../Context/LoadingContext';
import { QueryContext } from '../Context/QueryContext';

type Props = {
  todos: Todo[],
  newTodoField: React.RefObject<HTMLInputElement>,
  getErrorStatus: (errStatus: ErrorValues) => void,
  AddingTodos: () => void,
  changeAllTodosStatus: () => void,
};

export const TodosHeader: React.FC<Props> = ({
  todos,
  newTodoField,
  getErrorStatus,
  AddingTodos,
  changeAllTodosStatus,
}) => {
  const { isAdding } = useContext(LoaderContext);
  const { query, setQuery } = useContext(QueryContext);

  useEffect(() => {
    if (newTodoField.current && !isAdding) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  const SubmitForm = (event: React.FormEvent) => {
    event.preventDefault();

    if (!query.trim()) {
      getErrorStatus(ErrorValues.BLANKQUERY);
    } else {
      AddingTodos();
    }
  };

  const active = todos.every(todo => todo.completed);

  return (
    <>
      <header className="todoapp__header">
        {todos.length > 0 && (
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={classNames('todoapp__toggle-all', { active })}
            onClick={changeAllTodosStatus}
          />
        )}

        <form
          onSubmit={SubmitForm}
        >
          <input
            data-cy="NewTodoField"
            type="text"
            ref={newTodoField}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={query}
            onChange={event => setQuery(event.target.value)}
            disabled={isAdding}
          />
        </form>
      </header>
    </>
  );
};
