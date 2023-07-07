import { FC } from 'react';
import cn from 'classnames';
import '../styles/todoFooter.scss';
import { Todo } from '../types/Todo';
import { FilterTodos } from '../types/FilterTodos';

interface Props {
  visibleTodos: Todo[],
  filtredTodos: string,
  setFiltredTodos: (value: string) => void,
  handleClearCompletedTodos: () => void,
}

export const TodoFooter: FC<Props> = ({
  visibleTodos,
  filtredTodos,
  setFiltredTodos,
  handleClearCompletedTodos,
}) => {
  const isSomeCompeletedTodos = visibleTodos.some(todo => (
    todo.completed === true));

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${visibleTodos.length} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filtredTodos === FilterTodos.ALL,
          })}
          onClick={() => setFiltredTodos(FilterTodos.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filtredTodos === FilterTodos.ACTIVE,
          })}
          onClick={() => setFiltredTodos(FilterTodos.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filtredTodos === FilterTodos.COMPLETED,
          })}
          onClick={() => setFiltredTodos(FilterTodos.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={cn('todoapp__clear-completed',
          { isSomeCompeletedTodos: !isSomeCompeletedTodos })}
        onClick={handleClearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
