import cn from 'classnames';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  filterBy: Filter;
  handleSelect: (filterBy: Filter) => void;
  onDelete: (id: number) => void;
  activeTodos: () => Todo[];
  completedTodos: () => Todo[];
};

export const Footer: React.FC<Props> = ({
  filterBy,
  handleSelect,
  onDelete,
  activeTodos,
  completedTodos,
}) => {
  const allCompleted = completedTodos();

  const clearCompleted = () => {
    allCompleted.forEach(todo => onDelete(todo.id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos().length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(status => {
          const handleTodoStatus = () => {
            handleSelect(status);
          };

          return (
            <a
              href={`#/${status}`}
              className={cn('filter__link', {
                selected: filterBy === status,
              })}
              data-cy={`FilterLink${status}`}
              onClick={handleTodoStatus}
              key={status}
            >
              {status}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!allCompleted.length}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
