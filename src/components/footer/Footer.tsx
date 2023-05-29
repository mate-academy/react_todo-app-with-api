import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoFilter } from '../../types/TodoFilter';

type Props = {
  filterBy: string,
  setFilterBy: (select: TodoFilter) => void,
  todoList: Todo[],
  removeTodo:(id: number, place: string) => void,
  completedTodos: number,
  leftItems: number,
};

const { All, Active, Completed } = TodoFilter;

export const Footer: React.FC<Props> = ({
  filterBy,
  setFilterBy,
  todoList,
  removeTodo,
  completedTodos,
  leftItems,
}) => {
  const onDeleteCompleted = () => {
    todoList.forEach(todo => {
      if (todo.completed) {
        removeTodo(todo.id, 'completed');
      }
    });
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${leftItems} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: filterBy === All })}
          onClick={() => setFilterBy(All)}
        >
          {All}
        </a>

        <a
          href="#/active"
          className={cn('filter__link',
            { selected: filterBy === Active })}
          onClick={() => setFilterBy(Active)}
        >
          {Active}
        </a>

        <a
          href="#/completed"
          className={cn('filter__link',
            { selected: filterBy === Completed })}
          onClick={() => setFilterBy(Completed)}
        >
          {Completed}
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={onDeleteCompleted}
      >
        {!completedTodos ? '' : 'Clear completed'}
      </button>
    </footer>
  );
};
