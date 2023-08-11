import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { Filters } from '../../types/Filters';

type Props = {
  todos: Todo[],
  selectedFilter: Filters,
  onSetSelectedFilter: (char: Filters) => void,
  onDeleteTodo: (todoId: number[]) => void,
};

export const Filter: React.FC<Props> = ({
  todos,
  selectedFilter,
  onSetSelectedFilter,
  onDeleteTodo,
}) => {
  const activeTodos = todos.filter(t => t.completed === false);
  const completedTodos = todos.filter(t => t.completed === true);

  const handlerClearCompleted = () => {
    const completedTodosIds = completedTodos.map(t => t.id);

    onDeleteTodo(completedTodosIds);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {` ${activeTodos.length} items left`}
      </span>

      <nav className="filter">
        <button
          type="button"
          className={classNames(
            'filter__link', { selected: selectedFilter === Filters.All },
          )}
          onClick={() => onSetSelectedFilter(Filters.All)}
        >
          All
        </button>

        <button
          type="button"
          className={classNames(
            'filter__link', { selected: selectedFilter === Filters.Active },
          )}
          onClick={() => onSetSelectedFilter(Filters.Active)}
        >
          Active
        </button>

        <button
          type="button"
          className={classNames(
            'filter__link', { selected: selectedFilter === Filters.Completed },
          )}
          onClick={() => onSetSelectedFilter(Filters.Completed)}
        >
          Completed
        </button>
      </nav>

      <button
        type="button"
        className={classNames(
          'todoapp__clear-completed', { hidden: completedTodos.length < 1 },
        )}
        onClick={handlerClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
