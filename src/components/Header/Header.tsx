import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';
import { AddTodoForm } from '../AddTodoForm';

type Props = {
  query: string;
  setQuery: (value: string) => void;
  handleSubmit: () => void;
  tempTodo: Todo | null;
  todos: Todo[];
  handleUpdateFullCompleted: () => void,
  activeTodosAmount: number,
  setUpdatedTodoId: (type: boolean) => void,
};

export const Header: React.FC<Props> = React.memo(
  (
    {
      setQuery,
      query,
      handleSubmit,
      handleUpdateFullCompleted,
      tempTodo,
      todos,
      activeTodosAmount,
      setUpdatedTodoId,
    },
  ) => (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all', {
              active: activeTodosAmount,
            },
          )}
          onClick={() => {
            handleUpdateFullCompleted();
            setUpdatedTodoId(true);
          }}
          aria-label="some label"
        />
      )}
      <AddTodoForm
        setQuery={setQuery}
        query={query}
        handleSubmit={handleSubmit}
        tempTodo={tempTodo}
      />
    </header>
  ),
);
