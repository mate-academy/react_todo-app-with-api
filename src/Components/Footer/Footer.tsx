import { useContext, useMemo } from 'react';
import classNames from 'classnames';

import { Context } from '../../Context';
import { Filter } from '../../types/Filter';
import { ErrorMessage } from '../../types/ErrorMessage';
import { deleteTodo } from '../../api/todos';

export const Footer = () => {
  const {
    filter,
    setFilter,
    todos,
    setTodos,
    setErrorMessage,
  } = useContext(Context);

  const activeTodosCount = useMemo(() => {
    return todos.reduce((sum, item) => {
      if (!item.completed) {
        return sum + 1;
      }

      return sum;
    }, 0);
  }, [todos]);

  const clearCompleted = () => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    const deletePromises = completedTodoIds
      .map(todoId => deleteTodo(todoId));

    Promise.all(deletePromises)
      .then(() => {
        setTodos(prev => prev.filter(todo => !todo.completed));
      })
      .catch(() => setErrorMessage(ErrorMessage.UNABLE_TO_DELETE));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filter === Filter.ALL },
          )}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Filter.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filter === Filter.ACTIVE },
          )}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Filter.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filter === Filter.COMPLETED },
          )}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Filter.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={activeTodosCount === todos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
