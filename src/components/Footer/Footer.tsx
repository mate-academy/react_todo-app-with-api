import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { Filters } from '../../types/Filters';

interface Props {
  handleFilters: (filter: Filters) => Todo[];
  todos: Todo[];
  setTodos: (value: React.SetStateAction<Todo[]>) => void;
  selectedFilter: Filters;
  setLoadingTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
  setError: (value: React.SetStateAction<string>) => void;
}

export const Footer: React.FC<Props> = ({
  handleFilters,
  todos,
  setTodos,
  selectedFilter,
  setLoadingTodoIds,
  setError,
}) => {
  const todosLeft = todos.filter(todo => !todo.completed).length;
  const thereAreCompleted = todos.some(todo => todo.completed);

  const handleRemoveCompleted = async () => {
    const completedIds = todos.filter(t => t.completed).map(t => t.id);

    setLoadingTodoIds(completedIds);
    try {
      const deletePromises = completedIds.map(deleteTodo);

      await Promise.all(deletePromises);
      setTodos(todos.filter(t => !t.completed));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setLoadingTodoIds([]);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLeft === 1
          ? `${todosLeft} item left `
          : `${todosLeft} items left `}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: selectedFilter === Filters.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => handleFilters(Filters.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: selectedFilter === Filters.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => handleFilters(Filters.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: selectedFilter === Filters.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => handleFilters(Filters.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={cn('todoapp__clear-completed', {
          invisible: !thereAreCompleted,
        })}
        data-cy="ClearCompletedButton"
        onClick={handleRemoveCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
