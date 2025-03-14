/* eslint-disable @typescript-eslint/indent */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/enum';

interface PropsFooter {
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  filter: FilterType;
  todos: Todo[];
  handleClearCompleted: () => void;
}

export const TodoFooter: React.FC<PropsFooter> = ({
  setFilter,
  filter,
  todos,
  handleClearCompleted,
}) => {
  const disabledTodos = !todos.some(todo => todo.completed);
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasTodos = todos.length > 0;

  return (
    <>
      {hasTodos && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {activeTodosCount} items left
          </span>

          <nav className="filter" data-cy="Filter">
            {Object.values(FilterType).map(type => (
              <a
                key={type}
                href={`#/${type.toLowerCase()}`}
                className={classNames('filter__link', {
                  selected: filter === type,
                })}
                data-cy={`FilterLink${type.charAt(0).toUpperCase() + type.slice(1)}`}
                onClick={() => setFilter(type)}
              >
                {type}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            disabled={disabledTodos}
            onClick={handleClearCompleted}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
