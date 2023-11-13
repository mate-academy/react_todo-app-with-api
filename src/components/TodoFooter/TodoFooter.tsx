import cn from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { selectFilter } from '../../redux/selectors';
import { AppDispatch } from '../../redux/store';
import { Todo } from '../../types/Todo';
import { TodoFilter } from '../../types/TodoFilter';
import { deleteAllCompletedTodos } from '../../redux/todoThunks';
import { USER_ID } from '../../_utils/constants';

interface TodoFooterProps {
  todos: Todo[];
  filterChange: (filter: TodoFilter) => void;
}

export const TodoFooter: React.FC<TodoFooterProps> = (
  { todos, filterChange },
) => {
  const dispatch = useDispatch<AppDispatch>();
  const isCompleted = todos.some(todo => todo.completed === true);
  const currentFilter = useSelector(selectFilter);

  const handleDeleteAllCompleted = () => {
    dispatch(deleteAllCompletedTodos(USER_ID));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link',
            {
              selected: currentFilter === TodoFilter.All,
            })}
          data-cy="FilterLinkAll"
          onClick={() => filterChange(TodoFilter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link',
            {
              selected: currentFilter === TodoFilter.Active,
            })}
          data-cy="FilterLinkActive"
          onClick={() => filterChange(TodoFilter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link',
            {
              selected: currentFilter === TodoFilter.Completed,
            })}
          data-cy="FilterLinkCompleted"
          onClick={() => filterChange(TodoFilter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        style={{ visibility: isCompleted ? 'visible' : 'hidden' }}
        onClick={handleDeleteAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
