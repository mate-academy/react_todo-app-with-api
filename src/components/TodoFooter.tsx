import { useMemo } from 'react';
import { useTodoContext } from '../context';
import { deleteTodo } from '../api/todos';
import { TodoFilter } from './TodoFilter';
import { Errors } from '../types/Errors';

export const TodoFooter = () => {
  const {
    visibleTodos,
    allTodos,
    setAllTodos,
    errorHandler,
  } = useTodoContext();

  const activeTodos = useMemo(() => {
    const activeTodosArray = allTodos?.filter(todo => !todo.completed);

    return activeTodosArray?.length;
  }, [allTodos]);

  const handleClearCompleted = async () => {
    if (allTodos) {
      const completedTodos = allTodos.filter(todo => todo.completed);

      try {
        await Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));
        setAllTodos(allTodos.filter(todo => !todo.completed));
      } catch (error) {
        errorHandler(Errors.deleteError);
      }
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos} items left`}
      </span>

      <TodoFilter />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!visibleTodos?.some(todo => todo.completed)}
      >
        Clear completed
      </button>

    </footer>
  );
};
