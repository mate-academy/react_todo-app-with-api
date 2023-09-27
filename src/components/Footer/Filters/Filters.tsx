import { useTodo } from '../../../context/TodoContext';
import { FilterType } from '../../../types/FilterType';
import { FilterButton } from './FilterButton';

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
      <FilterButton
        name="All"
        data_cy="FilterLinkAll"
        href="#/"
        filter={filterTodos === 'all'
          ? 'filter__link selected' : 'filter__link'}
        onClick={() => addFilterType('all')}
      />
      <FilterButton
        name="Active"
        data_cy="FilterLinkActive"
        href="#/active"
        filter={filterTodos === 'active'
          ? 'filter__link selected' : 'filter__link'}
        onClick={() => addFilterType('active')}
      />
      <FilterButton
        name="Completed"
        data_cy="FilterLinkCompleted"
        href="#/completed"
        filter={filterTodos === 'completed'
          ? 'filter__link selected' : 'filter__link'}
        onClick={() => addFilterType('completed')}
      />
    </nav>
  );
};
