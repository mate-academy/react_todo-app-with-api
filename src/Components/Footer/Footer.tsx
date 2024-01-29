import { useContext } from 'react';
import classNames from 'classnames';

import { Context } from '../../Context';
import { Filter } from '../../types/Filter';
import { ErrorMessage } from '../../types/ErrorMessage';
import { deleteTodo } from '../../api/todos';

export const Footer = () => {
  const {
    handleActiveTodos,
    filter,
    setFilter,
    todos,
    setTodos,
    handleErrorChange,
  } = useContext(Context);

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
      .catch(() => handleErrorChange(ErrorMessage.UNABLE_TO_DELETE));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${handleActiveTodos} items left`}
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
        disabled={handleActiveTodos === todos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
