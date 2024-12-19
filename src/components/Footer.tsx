import React, { useMemo } from 'react';
import cn from 'classnames';
import { Filters } from '../types/enum/Filters';
import { Todo } from '../types/Todo';
import { Loading } from '../types/Loading';

type Props = {
  todos: Todo[];
  selectedFilter: Filters;
  onFilteredStatus: (filter: Filters) => void;
  onDeleteCompleted: () => void;
  setLoadingId: React.Dispatch<React.SetStateAction<Loading>>;
};

export const Footer: React.FC<Props> = props => {
  const {
    todos,
    selectedFilter,
    onFilteredStatus,
    onDeleteCompleted,
    setLoadingId,
  } = props;
  // const [isLoading, setIsLoading] = useState(false);

  const filtersValue = useMemo(() => Object.values(Filters), []);
  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );
  const isCompleted = useMemo(
    () => todos.some(todo => todo.completed),
    [todos],
  );
  let isDeleteCompleted = false;

  const handleDeleteCompleted = () => {
    setLoadingId({});
    isDeleteCompleted = true;
    onDeleteCompleted();
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>
      <nav className="filter" data-cy="Filter">
        {filtersValue.map(filter => (
          <a
            key={filter}
            href={`#/${filter !== Filters.All && filter.toLowerCase()}`}
            className={cn('filter__link', {
              selected: filter === selectedFilter,
            })}
            data-cy={`FilterLink${filter}`}
            onClick={() => onFilteredStatus(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={isDeleteCompleted || !isCompleted}
        style={{ visibility: !isCompleted ? 'hidden' : 'visible' }}
        onClick={handleDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
