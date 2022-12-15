import classNames from 'classnames';
import {
  useContext,
  Dispatch,
  SetStateAction,
} from 'react';
import { Todo } from '../../types/Todo';
import {
  deleteTodo,
  getTodos,
} from '../../api/todos';
import { AuthContext } from '../Auth/AuthContext';

interface Props {
  allTodos: Todo[] | null,
  activeTodos: Todo[] | null,
  setFilter: Dispatch<SetStateAction<string>>,
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

  const handleClearCompleted = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any[] = [];

    if (user && allTodos) {
      allTodos.forEach(todo => {
        if (todo.completed) {
          response.push(deleteTodo(todo.id));
        }
      });

      if (user) {
        await Promise.all(response);
        const newTodos: Todo[] = await getTodos(user.id);

        setAllTodos(newTodos);
      }
    }
  };

  const areCompleted = () => allTodos?.every(todo => !todo.completed);

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
                { filter__link: true },
                { selected: selectedFilter === 'all' },
              )}
              onClick={(event) => {
                setFilter('all');
                event.preventDefault();
              }}
            >
              All
            </a>

            <a
              data-cy="FilterLinkActive"
              href="#/active"
              className={classNames(
                { filter__link: true },
                { selected: selectedFilter === 'sctive' },
              )}
              onClick={(event) => {
                setFilter('active');
                event.preventDefault();
              }}
            >
              Active
            </a>
            <a
              data-cy="FilterLinkCompleted"
              href="#/completed"
              className={classNames(
                { filter__link: true },
                { selected: selectedFilter === 'completed' },
              )}
              onClick={(event) => {
                setFilter('completed');
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
