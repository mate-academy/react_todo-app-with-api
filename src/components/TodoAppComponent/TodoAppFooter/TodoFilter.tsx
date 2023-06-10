import { useTodosContext } from '../../../Context/TodosContext';
import { Filters } from '../../../types/Filters';

export const TodoFilter = () => {
  const { setFiltered, filtered } = useTodosContext();

  return (
    <nav className="filter">
      <a
        href="#/"
        className={filtered === Filters.All
          ? 'filter__link selected'
          : 'filter__link'}
        onClick={() => setFiltered(Filters.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={filtered === 'Active'
          ? 'filter__link selected'
          : 'filter__link'}
        onClick={() => setFiltered(Filters.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={filtered === 'Completed'
          ? 'filter__link selected'
          : 'filter__link'}
        onClick={() => setFiltered(Filters.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
