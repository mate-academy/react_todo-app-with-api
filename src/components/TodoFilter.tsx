import { memo, useContext, useMemo } from 'react';
import cn from 'classnames';

import { OptionsTodos } from '../constans';
import { TodosContext } from '../store/TodosContext';
import { getTodos } from '../utils/todoUtils';

export const TodoFilter = memo(function TodoFilterComponent() {
  const { todos, deletedTodos, option, setOption } = useContext(TodosContext);

  const activeTodos = useMemo(() => getTodos.active(todos), [todos]);

  const IsOneCompletedTodo = useMemo(
    () => getTodos.isOneCompleted(todos),
    [todos],
  );

  const allCompletedTodoId = useMemo(
    () => getTodos.allCompletedId(todos),
    [todos],
  );

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: option === OptionsTodos.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setOption(OptionsTodos.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: option === OptionsTodos.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setOption(OptionsTodos.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: option === OptionsTodos.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setOption(OptionsTodos.COMPLETED)}
        >
          Completed
        </a>
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!IsOneCompletedTodo}
        onClick={() => deletedTodos(allCompletedTodoId)}
      >
        Clear completed
      </button>
    </footer>
  );
});
