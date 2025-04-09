import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { CompleteStatus } from '../../types/CompleteStatus.enum';
import { memo } from 'react';

type Props = {
  filter: string;
  onFilter: (v: CompleteStatus) => void;
  activeTodosCount: number;
  complitedTodos: Todo[];
  onDelete: (v: number) => void;
};

export const Footer: React.FC<Props> = memo(
  ({
    filter,

    onFilter,
    activeTodosCount,
    complitedTodos,
    onDelete,
  }) => {
    const deleteAllCompletedTodos = () => {
      complitedTodos.map(todo => {
        onDelete(todo.id);
      });
    };

    return (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {activeTodosCount} items left
        </span>

        <nav className="filter" data-cy="Filter">
          {Object.values(CompleteStatus).map(status => {
            return (
              <a
                href="#/"
                key={status}
                className={cn('filter__link', {
                  selected: filter === status,
                })}
                data-cy={`FilterLink${status}`}
                onClick={() => onFilter(status)}
              >
                {status}
              </a>
            );
          })}
        </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          disabled={!complitedTodos.length}
          onClick={deleteAllCompletedTodos}
        >
          Clear completed
        </button>
      </footer>
    );
  },
);

Footer.displayName = 'Footer';
