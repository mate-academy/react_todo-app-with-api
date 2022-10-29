import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  filterLink: string,
  setFilter: (value:string) => void,
  todosClear: Todo[]
  handlerRemoveComleted: () => void,
  activeItems: number;

};

export const Footer: React.FC<Props> = ({
  filterLink,
  setFilter,
  todosClear,
  handlerRemoveComleted,
  activeItems,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeItems} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames('filter__link', {
            selected: filterLink === 'all',
          })}
          onClick={() => setFilter('all')}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames('filter__link', {
            selected: filterLink === 'active',
          })}
          onClick={() => setFilter('active')}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterLink === 'completed',
          })}
          onClick={() => setFilter('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={() => handlerRemoveComleted()}
      >
        {todosClear
          && todosClear.length > 0 && 'Clear completed'}
      </button>
    </footer>
  );
};
