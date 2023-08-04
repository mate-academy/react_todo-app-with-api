import classNames from 'classnames';
import React, { Dispatch, SetStateAction } from 'react';
import { removeTodo } from '../../api/todos';
import { Error, Filter, Todo } from '../../types/todo';

type Props = {
  setFilter: (filter: Filter) => void;
  filter: Filter;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setHasError: (value: Error) => void;
  setIsLoading: (value: boolean) => void;
  setCompletedIdx: Dispatch<SetStateAction<number[]>>;
};

export const Footer: React.FC<Props> = ({
  setFilter,
  filter,
  todos,
  setTodos,
  setHasError,
  setIsLoading,
  setCompletedIdx,
}) => {
  const countItems = todos.filter(todo => !todo.completed).length;
  const item = countItems > 1 ? 'items' : 'item';

  const changeFilterHandler = (
    e: React.MouseEvent<HTMLAnchorElement>,
    type: Filter,
  ) => {
    e.preventDefault();

    setFilter(type);
  };

  const clearCompletedHandler = () => {
    const ids = todos
      .filter(t => t.completed)
      .map(t => t.id);

    setCompletedIdx(ids);

    ids.forEach(id => {
      setIsLoading(true);
      setCompletedIdx(prev => [...prev, id]);

      removeTodo(id)
        .then(() => {
          setTodos(todos.filter(t => !t.completed));
        })
        .catch(() => {
          setHasError(Error.Delete);
        })
        .finally(() => {
          setIsLoading(false);
        });
    });
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${countItems} ${item} left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === Filter.All,
          })}
          onClick={(e) => changeFilterHandler(e, Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === Filter.Active,
          })}
          onClick={(e) => changeFilterHandler(e, Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === Filter.Completed,
          })}
          onClick={(e) => changeFilterHandler(e, Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      {todos.some(todo => todo.completed) && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={clearCompletedHandler}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
