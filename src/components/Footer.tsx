import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';
import { Filter } from './Filter';

interface FooterProps {
  filter: string,
  hasCompletedTodos: boolean,
  todosLength: number,
  onRemoveCompleted: () => void;
  onFilterChange: (filterType: FilterType) => void;
  todos: Todo[];
}

export const Footer: React.FC<FooterProps> = ({
  filter,
  hasCompletedTodos,
  todosLength,
  onRemoveCompleted,
  onFilterChange,
  todos,
}) => {
  const amoutOfActiveTodosLeft = todos.
    filter(todo => !todo.completed).length;

  return (
    todosLength > 0 ? (
      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${amoutOfActiveTodosLeft} items left`}
        </span>

        <Filter
          filter={filter}
          onFilterChange={onFilterChange}
        />

        <button
          type="button"
          className="todoapp__clear-completed"
          style={{ visibility: hasCompletedTodos ? 'visible' : 'hidden' }}
          onClick={onRemoveCompleted}
        >
          Clear completed
        </button>
      </footer>
    ) : null
  );
};
