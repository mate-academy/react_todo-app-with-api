import {
  FC, useContext, useState,
} from 'react';
import classNames from 'classnames/bind';
import { deleteTodo, getTodos } from '../../api/todos';
import { AppTodoContext } from '../AppTodoContext/AppTodoContext';
import { ErrorType } from '../Error/Error.types';
import { USER_ID } from '../../react-app-env';

enum FilterType {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const TodoFilter: FC = () => {
  const {
    todos,
    setTodos,
    setVisibleTodos,
    setErrorMessage,
    setProcessingTodoIDs,
    completedTodos,
    uncompletedTodos,
  } = useContext(AppTodoContext);
  const [currentFilter, setCurrentFilter] = useState<FilterType>(
    FilterType.All,
  );

  const handleClearCompleted = async () => {
    setProcessingTodoIDs(
      completedTodos.map(todo => todo.id),
    );

    completedTodos.forEach(async (todo) => {
      try {
        await deleteTodo(todo.id);
      } catch {
        setErrorMessage(ErrorType.DeleteTodoError);
      }
    });

    setProcessingTodoIDs([]);

    setVisibleTodos(prevVisTodos => {
      return prevVisTodos.filter(prevTodo => !prevTodo.completed);
    });
    setTodos(await getTodos(USER_ID));
  };

  const handleFiltration = async (criteria: FilterType) => {
    setErrorMessage(ErrorType.NoError);

    if (currentFilter === criteria) {
      return;
    }

    switch (criteria) {
      case FilterType.All:
        setVisibleTodos(todos);
        break;

      case FilterType.Completed:
        setVisibleTodos([...completedTodos]);
        break;

      case FilterType.Active:
        setVisibleTodos([...uncompletedTodos]);
        break;

      default:
        break;
    }

    setCurrentFilter(criteria);
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
              { selected: currentFilter === filter },
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
