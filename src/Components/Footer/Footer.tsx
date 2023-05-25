import { FC, memo, useCallback } from 'react';
import { deleteTodo } from '../../api/todos';
import { useTodoContext } from '../../TodoContext/TodoContext';
import { NewError } from '../../types/ErrorsList';
import { Status } from '../../types/TodoFilter';
import { TodoFilter } from '../TodoFilter/TodoFilter';

export const Footer: FC = memo(() => {
  const {
    todos,
    setTodos,
    filterBy,
    setFilterBy,
    setIsRemovingCompleted,
    setVisibleError,
  } = useTodoContext();

  const itemsLeft = todos.filter((todo) => !todo.completed).length;

  const handleRemoveCompletedTodos = useCallback(async () => {
    setIsRemovingCompleted(true);

    try {
      await Promise.all(
        todos
          .filter((todo) => todo.completed)
          .map((todo) => deleteTodo(todo.id)),
      );

      setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));
    } catch (error) {
      setVisibleError(NewError.Remove);
    } finally {
      setIsRemovingCompleted(false);
    }
  }, [todos]);

  const handleFilterChange = useCallback((newFilter: Status) => {
    setFilterBy(newFilter);
  }, []);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${itemsLeft} items left`}
      </span>

      <TodoFilter
        filterBy={filterBy}
        onFilterChange={handleFilterChange}
      />

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={handleRemoveCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
});
