import classNames from 'classnames';
import { FilterOption } from '../../types/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  filterField: FilterOption;
  onFilter: (filter: FilterOption) => void;
  onClearCompleted: () => void;
};

export const TodoFilter: React.FC<Props> = ({
  todos,
  filterField,
  onFilter,
  onClearCompleted,
}) => {
  const completedTodosCount = todos.filter(todo => todo.completed).length;
  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const getItemsText = (count: number) => {
    if (count === 0) {
      return 'Good job :)';
    }

    return `${count} item${count > 1 ? 's' : ''} left`;
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {getItemsText(activeTodosCount)}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterOption).map(option => (
          <a
            key={option}
            href={`#/${option === FilterOption.All ? '' : option.toLowerCase()}`}
            className={classNames('filter__link', {
              selected: filterField === option,
            })}
            data-cy={`FilterLink${option}`}
            onClick={() => onFilter(option)}
          >
            {option}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={!completedTodosCount}
      >
        Clear completed
      </button>
    </footer>
  );
};
