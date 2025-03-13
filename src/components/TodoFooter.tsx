import { Filters } from '../types/Filters';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  currentFilter: Filters;
  onFilter: (currentFilter: Filters) => void;
  onDelete: (todoIds: number[]) => void;
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  currentFilter,
  onFilter,
  onDelete,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const handleClearCompleted = () => {
    const todosCompletedId = completedTodos.map(todo => todo.id);

    onDelete(todosCompletedId);
  };

  // Створюємо мапу для атрибутів фільтрів
  const filterAttributes = {
    [Filters.All]: {
      name: 'All',
      href: '#/',
      dataCy: 'FilterLinkAll',
    },
    [Filters.Active]: {
      name: 'Active',
      href: '#/active',
      dataCy: 'FilterLinkActive',
    },
    [Filters.Completed]: {
      name: 'Completed',
      href: '#/completed',
      dataCy: 'FilterLinkCompleted',
    },
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filters).map(filter => {
          const { name, href, dataCy } = filterAttributes[filter];

          return (
            <a
              key={filter}
              href={href}
              className={cn('filter__link', {
                selected: currentFilter === filter,
              })}
              data-cy={dataCy}
              onClick={() => onFilter(filter)}
            >
              {name}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos.length}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
