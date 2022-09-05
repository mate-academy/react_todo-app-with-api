import classNames from 'classnames';
import { FC, useCallback } from 'react';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

type Props = {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  filterBy: string,
  setfilterBy: React.Dispatch<React.SetStateAction<string>>,
};

export const Footer: FC<Props> = (props) => {
  const {
    todos,
    setTodos,
    filterBy,
    setfilterBy,
  } = props;
  const deleteCompletedTodos = useCallback(() => {
    todos.map(todo => (todo.completed ? client.delete(`/todos/${todo.id}`) : todo));
    setTodos(prev => prev.filter(todo => !todo.completed));
  }, [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todos.filter(todo => todo.completed !== true).length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterBy === 'all' },
          )}
          onClick={() => setfilterBy('all')}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterBy === 'active' },
          )}
          onClick={() => setfilterBy('active')}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterBy === 'completed' },
          )}
          onClick={() => setfilterBy('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          { hidden: !todos.some(todo => todo.completed) },
        )}
        onClick={() => deleteCompletedTodos()}
        disabled={!todos.some(todo => todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
