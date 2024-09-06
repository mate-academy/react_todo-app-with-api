import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Status } from '../../types/status';

type Props = {
  onClick: (status: string) => void;
  status: string;
  leftItems: number;
  completedItems: Todo[];
  onDelete: () => void;
};

export const Footer: React.FC<Props> = ({
  onClick,
  status,
  leftItems,
  completedItems,
  onDelete,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {leftItems + ' items left'}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Status).map(link => (
          <a
            key={link}
            href={`#/${link}`}
            className={classNames('filter__link', {
              selected:
                status === link || (link === Status.All && status === ''),
            })}
            data-cy={`FilterLink${link}`}
            onClick={() => onClick(link)}
          >
            {link}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedItems.length}
        onClick={onDelete}
      >
        Clear completed
      </button>
    </footer>
  );
};
