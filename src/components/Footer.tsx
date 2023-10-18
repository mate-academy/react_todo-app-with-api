import classnames from 'classnames';
import { useContext, useCallback } from 'react';
import {
  AppContext,
  AppContextType,
  Filter,
} from '../Contexts/AppContextProvider';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

const Footer = () => {
  const {
    todos,
    setQueryCondition,
    queryCondition,
    activeItems,
    setIsFetching,
    setTodos,
    setErrorMessage,
  } = useContext(AppContext) as AppContextType;

  const deleteAllCompleted = useCallback(() => {
    const itemsToDelete: Todo[] = todos.filter((todo) => todo.completed);

    setIsFetching(true);

    itemsToDelete.map(async (todoToDel) => {
      setTodos((prev) => [...prev.filter((todo) => todo.id !== todoToDel.id)]);

      try {
        await client.delete(`/todos/${todoToDel.id}`);
      } catch {
        setTodos((prev) => [...prev, todoToDel].sort((a, b) => a.id - b.id));
        setErrorMessage('Unable to delete a todo');
      }
    });

    setIsFetching(false);
  }, [setErrorMessage, setIsFetching, setTodos, todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeItems} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classnames('filter__link', {
            selected: queryCondition === Filter.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setQueryCondition(Filter.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classnames('filter__link', {
            selected: queryCondition === Filter.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setQueryCondition(Filter.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classnames('filter__link', {
            selected: queryCondition === Filter.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setQueryCondition(Filter.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={activeItems === todos.length}
        onClick={deleteAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};

export { Footer };
