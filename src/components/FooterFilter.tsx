import cn from 'classnames';
import { useTodoContext } from '../context/TodoContext';
import { Filter } from '../types/Filter';
import { deleteTodo } from '../api/todos';
import { Error } from '../types/Error';

export const FooterFilter: React.FC = () => {
  const {
    todos,
    setTodos,
    filter,
    setFilter,
    setError,
    setIsCompletedTodosLoading,
  } = useTodoContext();

  const handleClearClick = async () => {
    const completedTodos = todos.filter((todo) => todo.completed);
    const todoIds = completedTodos.map((todo) => todo.id);

    setIsCompletedTodosLoading(true);

    try {
      await Promise.all(
        todoIds.map((todoId) => deleteTodo(todoId)),
      );

      setTodos((prevTodos) => {
        return prevTodos.filter((todo) => !todo.completed);
      });
      setIsCompletedTodosLoading(false);
    } catch {
      setError(Error.DELETE);
      setIsCompletedTodosLoading(false);
    }
  };

  return (
    <>
      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filter === Filter.ALL,
          })}
          onClick={() => setFilter(Filter.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === Filter.ACTIVE,
          })}
          onClick={() => setFilter(Filter.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === Filter.COMPLETED,
          })}
          onClick={() => setFilter(Filter.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {todos.some((todo) => todo.completed) && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={handleClearClick}
        >
          Clear completed
        </button>
      )}
    </>
  );
};
