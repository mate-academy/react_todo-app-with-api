import React, { useCallback, useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  filterOption: string;
  setFilterOption: (arg: string) => void;
  todosForRender: Todo[] | [];
  removeTodo:(arg: number) => void;
}

export const TodoFooter: React.FC<Props> = (props) => {
  const {
    filterOption,
    setFilterOption,
    todosForRender,
    removeTodo,
  } = props;

  const [anyTodoIsCompleted, setAnyTodoIsCompleted] = useState(false);

  const removeCompletedHandler = useCallback((
  ) => todosForRender.forEach(todo => {
    if (todo.completed) {
      removeTodo(todo.id);
    }
  }), [todosForRender]);

  useEffect(() => {
    setAnyTodoIsCompleted(todosForRender.some(todo => todo.completed));
  }, [todosForRender]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosForRender.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="src/components/Todo/TodoFooter#/"
          className={
            filterOption === 'All'
              ? 'filter__link selected'
              : 'filter__link'
          }
          onClick={(e) => {
            e.preventDefault();
            if (filterOption !== 'All') {
              setFilterOption('All');
            }
          }}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="src/components/Todo/TodoFooter#/active"
          className={
            filterOption === 'Active'
              ? 'filter__link selected'
              : 'filter__link'
          }
          onClick={(e) => {
            e.preventDefault();
            if (filterOption !== 'Active') {
              setFilterOption('Active');
            }
          }}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="src/components/Todo/TodoFooter#/completed"
          className={
            filterOption === 'Completed'
              ? 'filter__link selected'
              : 'filter__link'
          }
          onClick={(e) => {
            e.preventDefault();
            if (filterOption !== 'Completed') {
              setFilterOption('Completed');
            }
          }}
        >
          Completed
        </a>
      </nav>

      { anyTodoIsCompleted && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={removeCompletedHandler}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
