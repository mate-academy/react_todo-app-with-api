import classNames from 'classnames';
import { useContext } from 'react';
import { FilterStatus } from '../../types/FilterStatus';
import { TodosContext } from '../TodoContext/TodoContext';

export const Footer:React.FC = () => {
  const {
    todos,
    clearCompleted,
    filter,
    setFilter,
  } = useContext(TodosContext);

  const filteredTodos = todos.filter(todo => !todo.completed).length;
  const filtToComplete = todos.filter(todo => todo.completed).length;

  const handleChange = (status: FilterStatus) => {
    setFilter(status);
  };

  return (
    <>
      {todos
      && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {`${filteredTodos} items left`}
          </span>

          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className={classNames(
                'filter__link',
                { selected: filter === FilterStatus.All },
              )}
              data-cy="FilterLinkAll"
              onClick={() => handleChange(FilterStatus.All)}
            >
              All
            </a>

            <a
              href="#/active"
              className={classNames(
                'filter__link',
                { selected: filter === FilterStatus.Active },
              )}
              data-cy="FilterLinkActive"
              onClick={() => handleChange(FilterStatus.Active)}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={classNames(
                'filter__link',
                { selected: filter === FilterStatus.Completed },
              )}
              data-cy="FilterLinkCompleted"
              onClick={() => handleChange(FilterStatus.Completed)}
            >
              Completed
            </a>
          </nav>
          <div>
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={clearCompleted}
              disabled={!filtToComplete}
            >
              Clear completed
            </button>
          </div>
        </footer>
      )}
    </>
  );
};
