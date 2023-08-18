import cn from 'classnames';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

type Props = {
  status: string;
  onChangeStatus: (filterStatus: string) => void;
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
        {Object.values(Filter).map(item => (
          <a
            key={item}
            href={item !== Filter.all ? `#/${item.toLowerCase()}` : '#/'}
            className={cn('filter__link', { selected: status === item })}
            onClick={() => onChangeStatus(item)}
          >
            {item}
          </a>
        ))}
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
