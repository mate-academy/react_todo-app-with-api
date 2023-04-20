import { FC } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TaskStatus } from '../../types/Sort';

interface FilterProps {
  todos: Todo[];
  sortType: TaskStatus;
  onChangeSortType: (sortType: TaskStatus) => void;
  activeTodosCount: number;
  onRemove: (id: number) => void;
}

export const Filter: FC<FilterProps> = ({
  todos,
  sortType,
  onChangeSortType,
  activeTodosCount,
  onRemove,
}) => {
  const handleClearCompleted = () => {
    todos.forEach(({ completed, id }) => {
      return completed && onRemove(id);
    });
  };

  const correctTitle = `${activeTodosCount} ${
    activeTodosCount === 1
      ? 'item'
      : 'items'} left`;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {correctTitle}
      </span>

      <nav className="filter">
        <a
          href={`#/${TaskStatus.ALL}`}
          className={classNames('filter__link', {
            selected: sortType === TaskStatus.ALL,
          })}
          onClick={() => onChangeSortType(TaskStatus.ALL)}
        >
          All
        </a>

        <a
          href={`#/${TaskStatus.ACTIVE}`}
          className={classNames('filter__link', {
            selected: sortType === TaskStatus.ACTIVE,
          })}
          onClick={() => onChangeSortType(TaskStatus.ACTIVE)}
        >
          Active
        </a>

        <a
          href={`#/${TaskStatus.COMPLETED}`}
          className={classNames('filter__link', {
            selected: sortType === TaskStatus.COMPLETED,
          })}
          onClick={() => onChangeSortType(TaskStatus.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          'is-invisible': todos.every(todo => !todo.completed),
        })}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
