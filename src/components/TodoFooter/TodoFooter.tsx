import { useContext, useMemo } from 'react';
import classnames from 'classnames';
import { Status } from '../../types/Status';
import { FilterContext } from '../../context/FilterContext';
import { useTodo } from '../../context/TodoContext';
import { deleteTodo } from '../../api/todos';
import { useError } from '../../context/ErrorContext';

export const TodoFooter = () => {
  const { selectedFilter, setSelectedFilter } = useContext(FilterContext);
  const { todos, setTodos } = useTodo();
  const { setErrorMessage } = useError();

  const isActiveItemsLeft = todos
    .filter(({ completed }) => !completed).length;

  const hasCompletedTodo = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  const clearCompleted = () => {
    const deletePromises = todos
      .filter((todo) => todo.completed)
      .map(({ id }) => deleteTodo(id));

    Promise.all(deletePromises)
      .then(() => {
        setTodos((prevState) => prevState.filter((todo) => !todo.completed));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      });
  };

  return (
    <footer data-cy="Footer" className="todoapp__footer">
      <span className="todo-count" data-cy="TodosCounter">
        {isActiveItemsLeft > 1
          ? `${isActiveItemsLeft} items left`
          : '1 item left'}
      </span>

      <nav data-cy="Filter" className="filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classnames(
            'filter__link',
            {
              selected: selectedFilter === Status.All,
            },
          )}
          onClick={() => setSelectedFilter(Status.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classnames(
            'filter__link',
            {
              selected: selectedFilter === Status.Active,
            },
          )}
          onClick={() => setSelectedFilter(Status.Active)}
        >
          Active
        </a>

        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classnames(
            'filter__link',
            {
              selected: selectedFilter === Status.Completed,
            },
          )}
          onClick={() => setSelectedFilter(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        disabled={!hasCompletedTodo}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
