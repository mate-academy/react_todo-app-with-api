import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  filterBy: string,
  setFilterBy: (filterBy: string) => void,
  onDeleteCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = (
  {
    todos, filterBy, setFilterBy, onDeleteCompleted,
  },
) => {
  const completedTodos = todos.find(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {todos
          .filter(task => (
            !task.completed)).length}
        {' items left'}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames('filter__link', {
            selected: filterBy === 'all',
          })}
          onClick={() => setFilterBy('all')}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames('filter__link', {
            selected: filterBy === 'active',
          })}
          onClick={() => setFilterBy('active')}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterBy === 'completed',
          })}
          onClick={() => setFilterBy('completed')}
        >
          Completed
        </a>
      </nav>

      {completedTodos && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          disabled={!todos.some(
            todoItem => (
              todoItem.completed
            ),
          )}
          onClick={(event) => {
            event.preventDefault();

            onDeleteCompleted();
          }}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
