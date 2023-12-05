import cn from 'classnames';
import { Todo } from '../types/Todo';
import { Errors } from '../types/Errors';

interface Props {
  todosCounter: number,
  filterBy: string,
  setFilterBy: (value: string) => void,
  todos: Todo[],
  setTodos: (value: Todo[]) => void,
  setErrorMessage: (value: Errors) => void,
  setLoadingItemsId: (value: number[] | null) => void,
  onCompletedDelete: () => void
}

const filterButtons = [
  { id: 1, name: 'All' },
  { id: 2, name: 'Active' },
  { id: 3, name: 'Complited' },
];

export const Footer: React.FC<Props> = ({
  todosCounter,
  filterBy,
  setFilterBy,
  todos,
  onCompletedDelete,
}) => {
  const activeTodos = todos.filter(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosCounter} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filterButtons.map(button => (
          <a
            key={button.id}
            href="#/"
            className={cn('filter__link', {
              selected: filterBy === button.name,
            })}
            data-cy="FilterLinkAll"
            onClick={() => setFilterBy(button.name)}
          >
            {button.name}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onCompletedDelete}
        disabled={!(activeTodos.length > 0)}
      >
        Clear completed
      </button>

    </footer>
  );
};
