import { FC, useContext } from 'react';
import classNames from 'classnames';
import { Filter } from '../../types/FilterConditions';
import { TodoContext } from '../TodoProvider';

interface Props {
  filter: Filter;
  onChangeFilter: React.Dispatch<React.SetStateAction<Filter>>;
}

export const Footer: FC<Props> = ({
  filter,
  onChangeFilter,
}) => {
  const { todos, removeTodo } = useContext(TodoContext);

  const handleFilterClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onChangeFilter(event.currentTarget.textContent as Filter);
  };

  const filterNames = Object.values(Filter);
  const activeTodos = todos.filter(todo => !todo.completed);

  const handleClearCompletedClick = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        removeTodo?.(todo.id);
      }
    });
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} item${activeTodos.length > 1 ? 's' : ''} left`}
      </span>

      <nav className="filter">
        {filterNames.map(filterName => (
          <a
            key={filterName}
            href={filterName === Filter.All ? '#/' : `#/${filterName}`}
            onClick={handleFilterClick}
            className={classNames('filter__link', {
              selected: filter === filterName,
            })}
          >
            {filterName}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          'notification hidden': !todos.some(todo => todo.completed),
        })}
        onClick={handleClearCompletedClick}
      >
        Clear completed
      </button>

    </footer>
  );
};
