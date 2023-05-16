import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoFilter } from '../types/TodoFilter';

type Props = {
  countItemLeft: number | undefined;
  selectedFilter: TodoFilter
  setSelectedFilter: (selectedFilter: TodoFilter) => void;
  todoList: Todo [] | null;
  handlerDeleteClickFooter: (todoListHandler: Todo[] | null) => void
};

export const Footer: React.FC<Props> = ({
  countItemLeft,
  selectedFilter,
  setSelectedFilter,
  todoList,
  handlerDeleteClickFooter,
}) => {
  const { ALL, ACTIVE, COMPLETED } = TodoFilter;

  const handlerSelectAll = () => {
    setSelectedFilter(ALL);
  };

  const handlerSelectActive = () => {
    setSelectedFilter(ACTIVE);
  };

  const handlerSelectCompleted = () => {
    setSelectedFilter(COMPLETED);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${countItemLeft} items left`}
      </span>
      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: selectedFilter === ALL },
          )}
          onClick={handlerSelectAll}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: selectedFilter === ACTIVE },
          )}
          onClick={handlerSelectActive}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: selectedFilter === COMPLETED },
          )}
          onClick={handlerSelectCompleted}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        onClick={() => {
          handlerDeleteClickFooter(todoList);
        }}
        className={classNames(
          'todoapp__clear-completed',
          {
            'is-invisible': (!todoList?.find(todo => todo.completed)),
          },
        )}
      >
        Clear completed
      </button>

    </footer>
  );
};
