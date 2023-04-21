import {
  FC, useContext,
} from 'react';
import classNames from 'classnames/bind';
import { deleteTodo } from '../../api/todos';
import { AppTodoContext } from '../../contexts/AppTodoContext';
import {ErrorType, FilterType} from "../../types/enums";

export const TodoFilter: FC = () => {
  const {
    setTodos,
    setErrorMessage,
    setProcessingTodoIds,
    completedTodos,
    filterType,
    setFilterType,
    addProcessingTodo,
  } = useContext(AppTodoContext);

  const handleClearCompleted = async () => {
    completedTodos.forEach(async (todo) => {
      addProcessingTodo(todo.id);

      try {
        await deleteTodo(todo.id);
      } catch {
        setErrorMessage(ErrorType.DeleteTodoError);
      }
    });

    setProcessingTodoIds({});

    setTodos(prevTodos => {
      return prevTodos.filter(prevTodo => !prevTodo.completed);
    });
  };

  const handleFiltration = async (criteria: FilterType) => {
    setErrorMessage(ErrorType.NoError);

    if (filterType === criteria) {
      return;
    }

    setFilterType(criteria);
  };

  return (
    <>
      <nav className="filter">
        {Object.values(FilterType).map(filter => (
          <button
            type="button"
            aria-label="filter button"
            key={filter as string}
            className={classNames(
              'filter__link',
              { selected: filterType === filter },
            )}
            onClick={() => handleFiltration(filter)}
          >
            {[filter]}
          </button>
        ))}
      </nav>

      {completedTodos.length > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      )}
    </>
  );
};
