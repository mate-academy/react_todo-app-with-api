import { Todo } from '../types/Todo';
import cn from 'classnames';
import { TodoFilter } from '../types/TodoFilter';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  todos: Todo[];
  filterField: TodoFilter;
  onChangeFilter: Dispatch<SetStateAction<TodoFilter>>;
  clearCompleted: (allTodos: Todo[]) => void;
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  filterField,
  onChangeFilter,
  clearCompleted,
}) => {
  const todosCounter = [...todos].filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCounter} items left
      </span>

      {/* Active link should have the 'selected' class */}

      <nav className="filter" data-cy="Filter">
        {Object.values(TodoFilter).map(filter => (
          <a
            key={filter}
            href={`#/${filter.toLowerCase()}`}
            className={cn('filter__link', {
              selected: filterField === filter,
            })}
            data-cy={`FilterLink${filter}`}
            onClick={() => onChangeFilter(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      {/* {todosCounter !== todos.length && ( */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todosCounter === todos.length}
        onClick={() => clearCompleted(todos)}
      >
        Clear completed
      </button>
      {/* // )} */}
    </footer>
  );
};
