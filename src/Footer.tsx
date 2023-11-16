import { useContext, useMemo } from 'react';
import cn from 'classnames';
import { TodosContext } from './TodoContext';
import { filters } from './ultis/filters';

export const Footer = () => {
  const {
    filter,
    setFilter,
    todos,
    removeTodo,
  } = useContext(TodosContext);

  const todoLeft = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const handleClearCompleted = () => {
    const removePromises = todos
      .filter(todo => todo.completed)
      .map(todo => removeTodo(todo.id));

    Promise.all(removePromises);
  };

  return (
    <>
      {!!todos.length && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {`${todoLeft} items left`}
          </span>

          <nav className="filter" data-cy="Filter">
            {filters.map(({ href, status, data }) => (
              <a
                href={href}
                className={cn('filter__link', {
                  selected: status === filter,
                })}
                onClick={() => setFilter(status)}
                key={status}
                data-cy={data}
              >
                {status}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            onClick={handleClearCompleted}
            disabled={todoLeft === todos.length}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
