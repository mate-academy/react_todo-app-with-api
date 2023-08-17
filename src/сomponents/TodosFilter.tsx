import cn from 'classnames';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

type Props = {
  status: Filter;
  onChangeStatus: (filterStatus: Filter) => void;
  todos: Todo[];
  deleteTodo: (id: number) => void;
};

export const TodosFilter: React.FC<Props> = ({
  status,
  onChangeStatus,
  todos,
  deleteTodo,
}) => {
  const activeTodos = todos.reduce((sum, todo) => sum + +!todo.completed, 0);
  const haveCompleted = todos.some(todo => todo.completed === true);

  const handleClearCompleted = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => deleteTodo(todo.id));
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: status === Filter.all })}
          onClick={() => onChangeStatus(Filter.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', { selected: status === Filter.active })}
          onClick={() => onChangeStatus(Filter.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            cn('filter__link', { selected: status === Filter.completed })
          }
          onClick={() => onChangeStatus(Filter.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={cn('todoapp__clear-completed', { hidden: !haveCompleted })}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
