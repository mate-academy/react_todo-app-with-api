import {
  Dispatch,
  FC,
  memo,
  SetStateAction,
  useCallback,
  useMemo,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';
import { removeTodoById } from '../../api/todos';

type Props = {
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  filterType: FilterType,
  handleFilterTypeChange: (filterType: FilterType) => void,
  handleError: (msg: string) => void,
  setLoadingIds: Dispatch<SetStateAction<number[]>>,
};

export const TodoFooter: FC<Props> = memo((props) => {
  const {
    todos,
    setTodos,
    filterType,
    handleFilterTypeChange,
    handleError,
    setLoadingIds,
  } = props;

  const completedTodosIds = useMemo(() => (
    todos.filter(todo => todo.completed).map(todo => todo.id)
  ), [todos]);

  const handleRemoveCompletedTodos = useCallback(
    () => {
      const loadingIds = completedTodosIds;

      setLoadingIds(prev => [...prev, ...loadingIds]);
      const requests = loadingIds.map(id => removeTodoById(id));

      Promise.all(requests)
        .then(() => setTodos(prev => prev.filter(todo => !todo.completed)))
        .catch(() => handleError('Unable to delete todos'))
        .finally(() => setLoadingIds(prev => (
          prev.filter(id => !loadingIds.includes(id)))));
    },
    [completedTodosIds],
  );

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todos.length - completedTodosIds.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.All },
          )}
          onClick={() => handleFilterTypeChange(FilterType.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.Active },
          )}
          onClick={() => handleFilterTypeChange(FilterType.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.Completed },
          )}
          onClick={() => handleFilterTypeChange(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={handleRemoveCompletedTodos}
        disabled={completedTodosIds.length === 0}
      >
        Clear completed
      </button>

    </footer>
  );
});
