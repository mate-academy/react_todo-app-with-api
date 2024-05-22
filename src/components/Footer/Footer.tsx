import { deleteTodo } from '../../api/todos';
import { ErrorType } from '../../types/Error';
import { SortField } from '../../types/SortField';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  sortField: SortField;
  setSortField: (field: SortField) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<ErrorType | null>>;
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export const Footer: React.FC<Props> = ({
  todos,
  sortField,
  setSortField,
  setTodos,
  setError,
  setLoadingIds,
}) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed);

  const handleClearCompleted = () => {
    completedTodos.map(todo => {
      setLoadingIds(prevIds => [...prevIds, todo.id]);

      return deleteTodo(todo.id)
        .then(() => {
          setTodos(prevTodos =>
            prevTodos.filter(todoItem => todoItem.id !== todo.id),
          );
        })
        .catch(() => {
          setError(ErrorType.DeleteFail);
        })
        .finally(() => {
          setLoadingIds(prevIds => prevIds.filter(id => id !== todo.id));
        });
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} ${activeTodosCount === 1 ? 'item' : 'items'} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${sortField === SortField.All && 'selected'}`}
          data-cy="FilterLinkAll"
          onClick={() => setSortField(SortField.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${sortField === SortField.Active && 'selected'}`}
          data-cy="FilterLinkActive"
          onClick={() => setSortField(SortField.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${sortField === SortField.Completed && 'selected'}`}
          data-cy="FilterLinkCompleted"
          onClick={() => setSortField(SortField.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => handleClearCompleted()}
        disabled={!completedTodos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
