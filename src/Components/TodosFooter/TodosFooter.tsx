import { useCallback, useContext } from 'react';
import cn from 'classnames';
import { TodoContext } from '../../TodoContext/TodoContext';
import { Filters } from '../../utils/enums';
import { getAllTodos } from '../../api/todos';
import { client } from '../../utils/fetchClient';
import { USER_ID } from '../../utils/globalConst';

export const TodosFooter = () => {
  const {
    todos,
    setTodos,
    selectedFilter,
    setSelectedFilter,
    setClearingTodosId,
  } = useContext(TodoContext);

  const isAnyCompleted = todos.some(({ completed }) => completed);

  const activeTodosList = todos.filter(({ completed }) => !completed);

  const handleFilterSelection = useCallback((value: string) => {
    setSelectedFilter(value);
  }, [selectedFilter]);

  const visibleTodos = todos.filter(({ completed }) => {
    switch (selectedFilter) {
      case Filters.All:
        return true;

      case Filters.Active:
        return !completed;

      case Filters.Completed:
        return completed;

      default:
        return 0;
    }
  });

  const handleClearCompleted = async () => {
    setClearingTodosId(visibleTodos
      .filter(({ completed }) => completed)
      .map(({ id }) => id));

    const allTodosFromServer = await getAllTodos(USER_ID)
      .then(completedTodos => completedTodos);

    const activeTodos = allTodosFromServer
      .filter(({ completed }) => !completed);

    const completedTodos = allTodosFromServer
      .filter(({ completed }) => completed);

    await Promise.all(completedTodos.map(({ id }) => client.delete(`/todos/${id}`)));

    setClearingTodosId([]);

    setTodos(activeTodos);
  };

  return (
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer">
          <span className="todo-count">
            {`${activeTodosList.length} items left`}
          </span>

          <nav className="filter">
            <a
              href="#/"
              className={cn(
                'filter__link',
                { selected: selectedFilter === Filters.All },
              )}
              onClick={() => handleFilterSelection(Filters.All)}
            >
              All
            </a>

            <a
              href="#/active"
              className={cn('filter__link', {
                selected: selectedFilter === Filters.Active,
              })}
              onClick={() => handleFilterSelection(Filters.Active)}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={cn(
                'filter__link',
                { selected: selectedFilter === Filters.Completed },
              )}
              onClick={() => handleFilterSelection(Filters.Completed)}
            >
              Completed
            </a>
          </nav>

          <button
            type="button"
            className={cn('todoapp__clear-completed',
              { 'is-invisible': !isAnyCompleted })}
            onClick={handleClearCompleted}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
