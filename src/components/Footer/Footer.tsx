import cn from 'classnames';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { postTodo } from '../../api/todos';
import { FilterStatus } from '../../types/FilterStatus';
import { Todo } from '../../types/Todo';

type Props = {
  activeTodosCount: number;
  setFilterStatus: Dispatch<SetStateAction<FilterStatus>>;
  filterStatus: FilterStatus,
  deleteCompletedTodos: () => void;
  completedTodosCount: number;
  setUndoActive: Dispatch<SetStateAction<boolean>>
  undoActive: boolean
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
};

export const Footer:React.FC<Props> = ({
  activeTodosCount,
  setFilterStatus,
  filterStatus,
  deleteCompletedTodos,
  completedTodosCount,
  setUndoActive,
  undoActive,
  setTodos,
}) => {
  const [isUndoing, setUndoing] = useState(false);

  const handleUndo = () => {
    const deletedTodoStr = localStorage.getItem('deletedTodo');

    if (deletedTodoStr) {
      const deletedTodo = JSON.parse(deletedTodoStr);

      setUndoing(true);

      postTodo(deletedTodo)
        .then((newTodo) => {
          setTodos(current => [...current, newTodo]);
        }).finally(() => {
          setUndoing(false);
          setUndoActive(false);
        });
    }

    localStorage.removeItem('deletedTodo');
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link',
            { selected: filterStatus === FilterStatus.All })}
          onClick={() => setFilterStatus(FilterStatus.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link',
            { selected: filterStatus === FilterStatus.Active })}
          onClick={() => setFilterStatus(FilterStatus.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link',
            { selected: filterStatus === FilterStatus.Completed })}
          onClick={() => setFilterStatus(FilterStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className="filter__link has-background-warning is-outlined"
        style={{
          visibility: undoActive
            ? 'visible'
            : 'hidden',
        }}
        onClick={handleUndo}
      >
        {isUndoing ? 'Undoing...' : 'Undo'}
      </a>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={() => deleteCompletedTodos()}
        style={{
          visibility: completedTodosCount
            ? 'visible'
            : 'hidden',
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
