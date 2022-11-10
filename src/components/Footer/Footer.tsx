import classNames from 'classnames';
import { useCallback, useMemo } from 'react';
import { deleteTodos } from '../../api/todos';
import { Error } from '../../types/ErrorType';
import { FilterType } from '../../types/FilterType';
import { Todo } from '../../types/Todo';

type Props = {
  setFilterType: (filter: FilterType) => void;
  filterType: FilterType;
  todos: Todo[];
  completeTodos: Todo[];
  setSelectedTodosIds: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorNotification: React.Dispatch<React.SetStateAction<string | null>>;
  errorNotification: string | null;
  selectedTodosIds: number[];
};

export const Footer: React.FC<Props> = ({
  setFilterType,
  filterType,
  todos,
  completeTodos,
  setSelectedTodosIds,
  setTodos,
  setErrorNotification,
  errorNotification,
  selectedTodosIds,
}) => {
  const todosRemoved = useMemo(() => (
    todos.filter(({ completed }) => !completed)
  ), [todos]);

  const todosCompleted = useMemo(() => (
    todos.filter(todo => todo.completed).length),
  [todos]);

  const deleteCompletedTodo = useCallback(() => {
    setSelectedTodosIds(completeTodos.map(({ id }) => id));

    Promise.all(completeTodos.map(({ id }) => deleteTodos(id)))
      .then(() => setTodos((prevTodos) => prevTodos
        .filter(({ completed }) => !completed)))
      .catch(() => {
        setErrorNotification(Error.Delete);
        setSelectedTodosIds([]);
      });

    setSelectedTodosIds([]);
  }, [todos, selectedTodosIds, errorNotification]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosRemoved.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.All },
          )}
          onClick={() => setFilterType(FilterType.All)}
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
          onClick={() => setFilterType(FilterType.Active)}
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
          onClick={() => setFilterType(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={deleteCompletedTodo}
        disabled={!todosCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
