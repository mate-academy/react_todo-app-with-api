import { FC } from 'react';
import classNames from 'classnames';

import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';
import { CustomError } from '../types/CustomError';

import { useLoadStatusContext } from '../utils/LoadStatusContext';

type Props = {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  activeLeft: number,
  filter: Filter;
  setFilter: (filter: Filter) => void,
  setError: (newError: CustomError, delay?: number) => void,
};

export const FooterMenu: FC<Props> = ({
  todos,
  setTodos,
  activeLeft,
  filter,
  setFilter,
  setError,
}) => {
  const { setLoadingStatus } = useLoadStatusContext();
  const handleClearCompleted = () => {
    const deleteIds = todos.filter(({ completed }: Todo) => completed)
      .map(({ id }: Todo) => id);

    if (deleteIds.length) {
      setLoadingStatus([...deleteIds]);

      deleteIds.forEach(id => {
        deleteTodo(id)
          .then(() => {
            setTodos((prevTodos) => {
              return [
                ...prevTodos.filter(todo => todo.id !== id),
              ];
            });
          });
      });
    } else {
      setError(CustomError.Delete, 3000);
    }
  };

  return (
    <footer
      className="todoapp__footer"
    >
      <span className="todo-count">
        {`${activeLeft} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filter === Filter.All },
          )}
          onClick={() => setFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filter === Filter.Active },
          )}
          onClick={() => setFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filter === Filter.Completed },
          )}
          onClick={() => setFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={handleClearCompleted}
      >
        {activeLeft < todos.length ? 'Clear completed' : null}
      </button>
    </footer>

  );
};
