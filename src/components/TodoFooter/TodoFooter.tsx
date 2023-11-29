import cn from 'classnames';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  setTodos: (t: Todo[]) => void,
  filter: Filter,
  setFilter: (f: Filter) => void,
  deleteTodo: (n: number) => void,
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  setTodos,
  filter,
  setFilter,
  deleteTodo,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed).length;//
  const hasCompletedTodos = todos.some(todo => todo.completed === true);

  const handleClearCompletedTodos = () => {
    setTodos(todos.filter(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }

      return todo;
    }));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos} item${activeTodos > 1 ? 's' : ''} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link',
            { selected: filter === Filter.All })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link',
            { selected: filter === Filter.Active })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link',
            { selected: filter === Filter.Completed })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompletedTodos}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>

    </footer>
  );
};
