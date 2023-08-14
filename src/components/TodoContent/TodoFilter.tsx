import { FC, useContext } from 'react';
import classNames from 'classnames';
import { TodoContext } from '../TodoContext';
import { TodoStatus } from '../../types';

export const TodoFilter: FC = () => {
  const {
    todosCount,
    activeTodosLeft,
    filterBy,
    onFilterByChange,
    onDeleteCompletedTodos,
  } = useContext(TodoContext);

  const filterLinkClasses = (currentOption: TodoStatus) => (
    classNames('filter__link', {
      selected: filterBy === currentOption,
    })
  );

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosLeft} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={filterLinkClasses(TodoStatus.All)}
          onClick={() => onFilterByChange(TodoStatus.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={filterLinkClasses(TodoStatus.Active)}
          onClick={() => onFilterByChange(TodoStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={filterLinkClasses(TodoStatus.Completed)}
          onClick={() => onFilterByChange(TodoStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          'todoapp__clear-completed--active': activeTodosLeft !== todosCount,
        })}
        onClick={onDeleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
