import cn from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useState, useEffect } from 'react';
import { selectFilter } from '../../redux/selectors';
import { AppDispatch, RootState } from '../../redux/store';
import { TodoFilter } from '../../types/TodoFilter';
import { deleteAllCompletedTodos } from '../../redux/todoThunks';
import { USER_ID } from '../../_utils/constants';
import { setFilter } from '../../redux/todoSlice';

export const TodoFooter: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const todos = useSelector(
    (state: RootState) => state.todos.todos,
  );
  const remainingTodosList = todos.filter(todo => !todo.completed);
  const isCompleted = todos.some(todo => todo.completed === true);

  const currentFilter = useSelector(selectFilter);
  const [showFooter, setShowFooter] = useState(todos.length > 0);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;

    if (todos.length) {
      setShowFooter(true);
    } else {
      timeout = setTimeout(() => setShowFooter(false), 500);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [todos.length]);

  const handleDeleteAllCompleted = () => {
    dispatch(deleteAllCompletedTodos(USER_ID));
  };

  const handleFilterChange = (filter: TodoFilter) => {
    dispatch(setFilter(filter));
  };

  return (
    <TransitionGroup component={null}>
      {showFooter && (
        <CSSTransition
          in={showFooter}
          timeout={500}
          classNames="todoapp__footer todoapp__footer-transition"
          unmountOnExit
        >
          <footer
            className="todoapp__footer"
            data-cy="Footer"
          >
            <span className="todo-count" data-cy="TodosCounter">
              {`${remainingTodosList.length} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn('filter__link',
                  {
                    selected: currentFilter === TodoFilter.All,
                  })}
                data-cy="FilterLinkAll"
                onClick={() => handleFilterChange(TodoFilter.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link',
                  {
                    selected: currentFilter === TodoFilter.Active,
                  })}
                data-cy="FilterLinkActive"
                onClick={() => handleFilterChange(TodoFilter.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link',
                  {
                    selected: currentFilter === TodoFilter.Completed,
                  })}
                data-cy="FilterLinkCompleted"
                onClick={() => handleFilterChange(TodoFilter.Completed)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              style={{ visibility: isCompleted ? 'visible' : 'hidden' }}
              onClick={handleDeleteAllCompleted}
            >
              Clear completed
            </button>
          </footer>
        </CSSTransition>
      )}

    </TransitionGroup>
  );
};
