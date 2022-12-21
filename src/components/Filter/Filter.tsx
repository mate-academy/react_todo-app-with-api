import classNames from 'classnames';
import {
  useContext,
  Dispatch,
  SetStateAction,
  useCallback,
} from 'react';
import { Todo } from '../../types/Todo';
import {
  deleteTodo,
  getTodos,
} from '../../api/todos';
import { AuthContext } from '../Auth/AuthContext';
import { setIsLoadingContext } from '../Context/context';
import { Filters } from '../../types/filters';

interface Props {
  allTodos: Todo[] | null,
  activeTodos: Todo[] | null,
  setFilter: Dispatch<SetStateAction<Filters>>,
  selectedFilter: string,
  setAllTodos: Dispatch<SetStateAction<Todo[] | null>>,
}

export const Filter: React.FC<Props> = (props) => {
  const {
    allTodos,
    activeTodos,
    setFilter,
    selectedFilter,
    setAllTodos,
  } = props;

  const user = useContext(AuthContext);
  const setIsLoading = useContext(setIsLoadingContext);

  const handleClearCompleted = useCallback(async () => {
    if (user && allTodos) {
      const response = allTodos.map(todo => {
        if (todo.completed) {
          setIsLoading((prev) => [...prev, todo.id]);

          return (deleteTodo(todo.id));
        }

        return todo;
      });

      if (user) {
        await Promise.all(response);
        const newTodos: Todo[] = await getTodos(user.id);

        setIsLoading([]);
        setAllTodos(newTodos);
      }
    }
  }, [user, allTodos]);

  const areCompleted = useCallback(
    () => allTodos?.every(todo => !todo.completed), [allTodos],
  );

  return (
    <>
      {(allTodos && allTodos.length > 0) && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="todosCounter">
            {`${activeTodos?.length} items left`}
          </span>

          <nav className="filter" data-cy="Filter">
            <a
              data-cy="FilterLinkAll"
              href="#/"
              className={classNames(
                'filter__link',
                { selected: selectedFilter === Filters.all },
              )}
              onClick={(event) => {
                setFilter(Filters.all);
                event.preventDefault();
              }}
            >
              All
            </a>

            <a
              data-cy="FilterLinkActive"
              href="#/active"
              className={classNames(
                'filter__link',
                { selected: selectedFilter === Filters.active },
              )}
              onClick={(event) => {
                setFilter(Filters.active);
                event.preventDefault();
              }}
            >
              Active
            </a>
            <a
              data-cy="FilterLinkCompleted"
              href="#/completed"
              className={classNames(
                'filter__link',
                { selected: selectedFilter === Filters.completed },
              )}
              onClick={(event) => {
                setFilter(Filters.completed);
                event.preventDefault();
              }}
            >
              Completed
            </a>
          </nav>

          <button
            disabled={areCompleted()}
            data-cy="ClearCompletedButton"
            type="button"
            className="todoapp__clear-completed"
            onClick={handleClearCompleted}
          >
            Clear completed
          </button>

        </footer>
      )}
    </>
  );
};
