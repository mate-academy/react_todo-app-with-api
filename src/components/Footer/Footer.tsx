import classnames from 'classnames';
import { useCallback, useMemo } from 'react';
import { deleteTodo } from '../../api/todos';
import { ErrorMessage } from '../../types/Error';
import { FilterType } from '../../types/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  filterType: FilterType | string;
  filterTypes: (arg: FilterType) => void;
  completedTodos: Todo[];
  setSelectedId: React.Dispatch<React.SetStateAction<number[]>>;
  selectedId: number[];
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  errorMessage: string;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterType,
  filterTypes,
  completedTodos,
  setSelectedId,
  selectedId,
  setErrorMessage,
  errorMessage,
  setTodos,
}) => {
  const todosLeft = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const deleteCompletedTodos = useCallback(async () => {
    setSelectedId(completedTodos.map((todo => todo.id)));

    await Promise.all(completedTodos.map(({ id }) => deleteTodo(id)))
      .then(() => setTodos((prevTodos) => prevTodos
        .filter(({ completed }) => !completed)))
      .catch(() => {
        setErrorMessage(ErrorMessage.NotDelete);
        setSelectedId([]);
      });

    setSelectedId([]);
  }, [todos, selectedId, errorMessage]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classnames(
            'filter__link',
            { selected: filterType === FilterType.All },
          )}
          onClick={() => filterTypes(FilterType.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classnames(
            'filter__link',
            { selected: filterType === FilterType.Active },
          )}
          onClick={() => filterTypes(FilterType.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classnames(
            'filter__link',
            { selected: filterType === FilterType.Completed },
          )}
          onClick={() => filterTypes(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>
      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={deleteCompletedTodos}
        disabled={!completedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
