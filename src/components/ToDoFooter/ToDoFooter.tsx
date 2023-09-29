import cn from 'classnames';
import { useToDoContext } from '../../context/ToDo.context';
import { useTodoFilter } from './useToDoFilter';
import { Filter } from './types';
import { Todo } from '../../types/Todo';

export const ToDoFooter:React.FC = () => {
  const { todos } = useToDoContext();
  const {
    changeFilter,
    active, activeFilter, clearCompleted,
  } = useTodoFilter();

  if (todos.length === 0) {
    return (<></>);
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${active} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: activeFilter === Filter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => changeFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: activeFilter === Filter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => changeFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: activeFilter === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => changeFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.filter(({ completed }:Todo) => completed).length === 0}
        onClick={() => clearCompleted()}
      >
        Clear completed
      </button>
    </footer>
  );
};
