import cn from 'classnames';
import { Todo } from '../types/Todo';
import { FilterTypes } from '../types/Filter';

type Props = {
  visibletodos: Todo[];
  filter: FilterTypes,
  setFilter: (filter: FilterTypes) => void;
  onDeleteTodo:(value:number) => void;
};

export const Filter: React.FC<Props> = ({
  visibletodos,
  filter,
  setFilter,
  onDeleteTodo,
}) => {
  const amountActiveTodos = visibletodos.filter(todo => !todo.completed).length;
  const availableCompletedTodos = visibletodos.some((todo) => todo.completed);
  const allCompletedTodos = visibletodos.filter(todo => todo.completed);

  const clearCompletedTodos = () => {
    allCompletedTodos.forEach(todo => onDeleteTodo(todo.id));
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {amountActiveTodos === 1
          ? `${amountActiveTodos} item left`
          : `${amountActiveTodos} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filter === FilterTypes.All,
          })}
          onClick={() => {
            setFilter(FilterTypes.All);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === FilterTypes.Active,
          })}
          onClick={() => {
            setFilter(FilterTypes.Active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === FilterTypes.Completed,
          })}
          onClick={() => {
            setFilter(FilterTypes.Completed);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={cn('todoapp__clear-completed',
          { 'is-invisible': !availableCompletedTodos })}
        onClick={clearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
