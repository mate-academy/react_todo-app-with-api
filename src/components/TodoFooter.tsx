import { useContext } from 'react';
import cn from 'classnames';
import { Filter } from '../types/Filter';
import { TodosContext } from './TodoProvider';

export const TodoFooter: React.FC = () => {
  const {
    todos,
    setTodos,
    removeTodo,
    setFilterType,
    filterType,
  } = useContext(TodosContext);

  const clearCompleted = () => {
    const filteredTodos = todos.filter(todo => todo.completed);

    filteredTodos.map(todo => removeTodo(todo.id));
    const clearTodo = todos.map(todo => (
      { ...todo, completed: false }
    ));

    setTodos(clearTodo);
  };

  const filterByTodos = (filter: Filter) => {
    setFilterType(filter);
  };

  const uncompletedCount = todos.filter(todo => !todo.completed);

  const findCompleted = todos.find(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${uncompletedCount.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterType === Filter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => filterByTodos(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterType === Filter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => filterByTodos(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterType === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => filterByTodos(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      {findCompleted && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={clearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
