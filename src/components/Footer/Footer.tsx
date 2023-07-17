import { FC } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  filter: string | null;
  setFilter: React.Dispatch<React.SetStateAction<string | null>>;
  clearCompletedTodos: () => void;
}

export const Footer:FC<Props> = ({
  todos,
  filter,
  setFilter,
  clearCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todos.filter(todo => !todo.completed).length} items left`}
      </span>
      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filter === '' },
          )}
          onClick={() => setFilter('')}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filter === 'Active' },
          )}
          onClick={() => setFilter('Active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filter === 'Completed' },
          )}
          onClick={() => setFilter('Completed')}
        >
          Completed
        </a>
      </nav>

      {todos.filter(todo => todo.completed).length !== 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={clearCompletedTodos}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
