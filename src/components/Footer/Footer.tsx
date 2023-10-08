import { useCallback, useContext } from 'react';
import classNames from 'classnames';
import { Status } from '../../types/FilterEnum';
import { TodoContext } from '../TodoContext';
import * as PostService from '../../api/todos';
import { ErrorMessage } from '../../types/ErrorMessageEnum';

export const Footer: React.FC = () => {
  const {
    todos,
    setTodos,
    filterBy,
    setFilterBy,
    setErrorOccured,
    setChangingId,
  } = useContext(TodoContext);

  const clearButton = todos.some(todo => todo.completed);

  const handleClearButton = () => {
    const clearCompletedTodos = todos
      .filter(todo => todo.completed)
      .map(todo => {
        setChangingId(current => [...current, todo.id]);

        return PostService.deleteTodo(todo.id);
      });

    Promise.all(clearCompletedTodos)
      .then(() => {
        const completedTodos = todos.filter(todo => !todo.completed);

        setTodos(completedTodos);
      })
      .catch(() => {
        setTodos(todos);
        setErrorOccured(ErrorMessage.noDeleteTodo);
        setTimeout(() => {
          setErrorOccured('');
        }, 3000);
      })
      .finally(() => setChangingId([]));
  };

  const handleCount = useCallback(() => {
    const filteredTodos = todos.filter(
      todo => !todo.completed,
    );

    return filteredTodos.length;
  }, [todos]);

  const count = handleCount();

  return (
    <>
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {count === 0 ? (
            `${count} item left`
          ) : (
            `${count} items left`
          )}
        </span>

        {/* Active filter should have a 'selected' class */}
        <nav className="filter" data-cy="Filter">
          <a
            href="#/"
            className={classNames('filter__link', {
              selected: filterBy === Status.All,
            })}
            data-cy="FilterLinkAll"
            onClick={() => setFilterBy(Status.All)}
          >
            All
          </a>

          <a
            href={`#/${Status.Active}`}
            className={classNames('filter__link', {
              selected: filterBy === Status.Active,
            })}
            data-cy="FilterLinkActive"
            onClick={() => setFilterBy(Status.Active)}
          >
            Active
          </a>

          <a
            href={`#/${Status.Completed}`}
            className={classNames('filter__link', {
              selected: filterBy === Status.Completed,
            })}
            data-cy="FilterLinkCompleted"
            onClick={() => setFilterBy(Status.Completed)}
          >
            Completed
          </a>
        </nav>

        {/* don't show this button if there are no completed todos */}
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleClearButton}
          disabled={!clearButton}
        >
          Clear completed
        </button>
      </footer>
    </>
  );
};
