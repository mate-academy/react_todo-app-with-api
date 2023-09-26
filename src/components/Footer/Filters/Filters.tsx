import { useTodo } from '../../../provider/todoProvider';
import { FilterType } from '../../../types/FilterType';

export const Filters = () => {
  const {
    handleSetFilterTodos,
    filterTodos,
  } = useTodo();

  const addFilterType = (filterType: FilterType) => {
    handleSetFilterTodos(filterType);
  };

  return (
    <nav
      data-cy="Filter"
      className="filter"
    >
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={filterTodos === 'all'
          ? 'filter__link selected' : 'filter__link'}
        onClick={() => addFilterType('all')}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={filterTodos === 'active'
          ? 'filter__link selected' : 'filter__link'}
        onClick={() => addFilterType('active')}
      >
        Active
      </a>

      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={filterTodos === 'completed'
          ? 'filter__link selected' : 'filter__link'}
        onClick={() => addFilterType('completed')}
      >
        Completed
      </a>
    </nav>
  );
};
