import { FC } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterValue } from '../../types/FilterValue';

interface Props {
  todos: Todo[],
  setFilterValue: (value: FilterValue) => void,
  filterValue: string,
  deleteTodo: (todoId: number) => void,
  activeTodosCounter: number,
}

export const Footer: FC<Props> = (props) => {
  const {
    todos,
    setFilterValue,
    filterValue,
    deleteTodo,
    activeTodosCounter,
  } = props;

  const completedTodosLength = todos.filter(todo => todo.completed).length;

  const handleClearCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => deleteTodo(todo.id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCounter} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: filterValue === 'all' })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterValue(FilterValue.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', { selected: filterValue === 'active' })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterValue(FilterValue.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link',
            { selected: filterValue === 'completed' })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterValue(FilterValue.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed hidden"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompletedTodos}
        style={{
          visibility: completedTodosLength !== 0
            ? 'visible' : 'hidden',
        }}
      >
        Clear completed
      </button>

    </footer>
  );
};
