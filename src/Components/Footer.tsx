import { useContext, useMemo } from 'react';
import { TodoContext } from './TodoContext';
import classNames from 'classnames';
import { FilterSettings } from './TodoContext';
import { deleteTodo } from '../api/todos';

export const Footer = () => {
  const {
    todosList,
    setTodosList,
    filterSettings,
    setFilterSettings,
    setErrorMessage,
    setNewTodosProcessing,
    setListOfProcessingTodos,
    setIsLoading,
  } = useContext(TodoContext);

  const completedTodos = useMemo(
    () => todosList.filter(todo => todo.completed),
    [todosList],
  );
  const unCompletedTodos = useMemo(
    () => todosList.filter(todo => !todo.completed),
    [todosList],
  );

  const handleFiltering = (value: FilterSettings) => {
    setFilterSettings(value);
  };

  const handleClearCompleted = () => {
    setNewTodosProcessing(true);
    setIsLoading(true);

    todosList.map(todo => {
      if (todo.completed) {
        setListOfProcessingTodos(todosList.filter(item => item.completed));
        deleteTodo(todo.id)
          .then(() => {
            setTodosList(todosList.filter(item => item.id !== todo.id));
          })
          .catch(() => setErrorMessage('Unable to delete a todo'))
          .finally(() => {
            setNewTodosProcessing(false);
            setListOfProcessingTodos([]);
            setIsLoading(false);
          });
      }
    });
  };

  return (
    !!todosList.length && (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {unCompletedTodos.length} items left
        </span>

        <nav className="filter" data-cy="Filter">
          <a
            href="#/"
            className={classNames('filter__link', {
              selected: filterSettings === FilterSettings.all,
            })}
            data-cy="FilterLinkAll"
            onClick={() => handleFiltering(FilterSettings.all)}
          >
            All
          </a>

          <a
            href="#/active"
            className={classNames('filter__link', {
              selected: filterSettings === FilterSettings.active,
            })}
            data-cy="FilterLinkActive"
            onClick={() => handleFiltering(FilterSettings.active)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={classNames('filter__link', {
              selected: filterSettings === FilterSettings.completed,
            })}
            data-cy="FilterLinkCompleted"
            onClick={() => handleFiltering(FilterSettings.completed)}
          >
            Completed
          </a>
        </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleClearCompleted}
          disabled={!completedTodos.length}
        >
          Clear completed
        </button>
      </footer>
    )
  );
};
