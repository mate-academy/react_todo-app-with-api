import classNames from 'classnames';
import { FilterStatus } from '../../types/FilterStatus';
import { useTodosContext } from '../../hook/useTodosContext';

export const Footer = () => {
  const {
    todos,
    filteredTodos,
    filterTodosStatus,
    deleteAllCompletedTodos,
    dispatch,
  } = useTodosContext();

  const activeTodosCounter = todos.filter(todo => !todo.completed).length;

  const hasCompletedTodos = filteredTodos.some(todo => todo.completed);

  return (
    todos.length > 0 && (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {activeTodosCounter} items left
        </span>

        <nav className="filter" data-cy="Filter">
          {Object.values(FilterStatus).map(value => (
            <a
              key={value}
              href="#/"
              className={classNames('filter__link', {
                selected: filterTodosStatus === value,
              })}
              data-cy={`FilterLink${value}`}
              onClick={() =>
                dispatch({ type: 'SET_FILTER_STATUS', payload: value })
              }
            >
              {value}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          disabled={!hasCompletedTodos}
          onClick={deleteAllCompletedTodos}
        >
          Clear completed
        </button>
      </footer>
    )
  );
};
