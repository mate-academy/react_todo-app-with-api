import cn from 'classnames';
import { Sort } from '../types/Sort';
import { Todo } from '../types/Todo';

type Props = {
  activeTodo: Todo[];
  completedTodo: Todo[];
  onDeleteCompleted: () => void;
  sortBy: Sort;
  setSortBy: React.Dispatch<React.SetStateAction<Sort>>;
};

export const Footer: React.FC<Props> = ({
  activeTodo,
  completedTodo,
  onDeleteCompleted,
  sortBy,
  setSortBy,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodo.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: sortBy === Sort.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setSortBy(Sort.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: sortBy === Sort.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setSortBy(Sort.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: sortBy === Sort.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setSortBy(Sort.completed)}
        >
          Completed
        </a>
      </nav>

      {completedTodo.length === 0 ? (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          disabled
        >
          Clear completed
        </button>
      ) : (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={onDeleteCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
