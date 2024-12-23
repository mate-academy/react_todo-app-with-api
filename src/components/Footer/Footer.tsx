import { Dispatch, SetStateAction, useMemo } from 'react';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';
import cN from 'classnames';

type Props = {
  todos: Todo[];
  activeFilter: Filter;
  setActiveFilter: Dispatch<SetStateAction<Filter>>;
  setLoadingTodoIds: Dispatch<SetStateAction<number[]>>;
  onDelete: (id: number) => Promise<void>;
  setFocusOnAddInput: () => void;
};

const filterValues = Object.values(Filter);

export const Footer: React.FC<Props> = ({
  todos,
  activeFilter,
  setActiveFilter,
  setLoadingTodoIds,
  onDelete,
  setFocusOnAddInput,
}) => {
  const activeCount: number = useMemo(() => {
    return todos.reduce((acc, todo) => {
      if (todo.completed === false) {
        return acc + 1;
      }

      return acc;
    }, 0);
  }, [todos]);

  const hasCompleted = useMemo(() => {
    return todos.some(todo => todo.completed === true);
  }, [todos]);

  function handleClearCompleted() {
    const completedTodoIds = todos.reduce(
      (acc, todo) => (todo.completed ? [...acc, todo.id] : acc),
      [] as number[],
    );

    setLoadingTodoIds(completedTodoIds);

    const promises = completedTodoIds.map(id => onDelete(id));

    Promise.all(promises).then(() => {
      setFocusOnAddInput();
    });
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterValues.map(filter => {
          return (
            <a
              key={filter}
              href={`#/${filter === 'All' ? '' : filter}`}
              className={cN('filter__link', {
                selected: activeFilter === filter,
              })}
              data-cy={`FilterLink${filter}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </a>
          );
        })}
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
