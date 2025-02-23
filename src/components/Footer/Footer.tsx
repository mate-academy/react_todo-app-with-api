import { FilterType } from '../../types/FilterType';
import classNames from 'classnames';
import { deleteTodo } from '../../api/todos';
import { FooterType } from '../../types/FooterType';

export const Footer: React.FC<FooterType> = ({
  todos,
  setTodos,
  currentFilter,
  setCurrentFilter,
  setError,
  setIsLoadingIds,
}) => {
  const completedTodos = todos.filter(todo => todo.completed);
  const TodoCount = todos.length - completedTodos.length;

  const handleClearComplete = () => {
    const completedTodoIds = completedTodos.map(todo => todo.id);

    setIsLoadingIds(currentIds => [...currentIds, ...completedTodoIds]);

    Promise.allSettled(
      completedTodoIds.map(id => {
        return deleteTodo(id)
          .then(() => {
            setTodos(currentToDos =>
              currentToDos.filter(item => item.id !== id),
            );
          })
          .catch(() => {
            setError('Unable to delete a todo');
          });
      }),
    ).finally(() => {
      setIsLoadingIds([]);
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {TodoCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: currentFilter === FilterType.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setCurrentFilter(FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: currentFilter === FilterType.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setCurrentFilter(FilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: currentFilter === FilterType.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setCurrentFilter(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos.length === 0}
        onClick={handleClearComplete}
      >
        Clear completed
      </button>
    </footer>
  );
};
