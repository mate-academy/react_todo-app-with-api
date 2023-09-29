import cn from 'classnames';
import { useContext } from 'react';
import { TodosContext } from '../context/TodoContext';
import { deleteTodo } from '../api/todos';
import { ErrorType } from '../types/Errors';

export const Footer = () => {
  const {
    todos,
    handleSelectFilter,
    selectedFilter,
    setTodos,
    activeTodos,
    completedTodos,
    handleError,
  } = useContext(TodosContext);

  return (
    <div>
      {!!todos.length
        && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodos.length} items left`}
            </span>
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn({
                  filter__link: true,
                  selected: selectedFilter === 'all',
                })}
                data-cy="FilterLinkAll"
                onClick={() => handleSelectFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn({
                  filter__link: true,
                  selected: selectedFilter === 'active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => handleSelectFilter('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn({
                  filter__link: true,
                  selected: selectedFilter === 'completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => handleSelectFilter('completed')}
              >
                Completed
              </a>
            </nav>
            <button
              type="button"
              className={cn({
                'todoapp__clear-completed': true,
                'todoapp__clear-completed--disabled':
                  completedTodos.length === 0,
              })}
              data-cy="ClearCompletedButton"
              disabled={completedTodos.length === 0}
              onClick={() => setTodos(todos.filter((todo) => {
                return (todo.completed)
                  ? (deleteTodo(todo.id)
                    .catch(() => handleError(ErrorType.Delete)), false)
                  : true;
              }))}
            >
              Clear completed
            </button>
          </footer>
        )}
    </div>
  );
};
