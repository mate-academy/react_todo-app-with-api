import classNames from 'classnames';
import React, { useContext } from 'react';
import { TodoFilter } from '../../types/enums/TodosFilter';
import { TodosContext } from '../../utils/context';
import { client } from '../../utils/fetchClient';
import { TodoError } from '../../types/enums/TodoError';

type Props = {
  filterChange: (filter: TodoFilter) => void;
  currentFilter: TodoFilter;
};

export const Footer: React.FC<Props> = ({ filterChange, currentFilter }) => {
  const {
    todos,
    setTodos,
    setErrorMessage,
    setIsErrorVisible,

    setTodosIdsWithActiveLoader,
  } = useContext(TodosContext);

  const handledClearAllCompleted = () => {
    const allCompletedTodos = todos.filter(todo => todo.completed);
    const allCompletedTodosId = allCompletedTodos.map(todo => todo.id);

    setTodosIdsWithActiveLoader(allCompletedTodosId);
    allCompletedTodos.forEach(todo => {
      client
        .delete(`/todos/${todo.id}`)
        .catch(() => {
          setIsErrorVisible(true);
          setErrorMessage(TodoError.UnableToDelete);
        })
        .finally(() => {
          setTodosIdsWithActiveLoader([]);
          const allNotCompletedTodos = todos.filter(item => !item.completed);

          setTodos(allNotCompletedTodos);
        });
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.filter(todo => !todo.completed).length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: currentFilter === TodoFilter.All,
          })}
          onClick={() => filterChange(TodoFilter.All)}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: currentFilter === TodoFilter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => filterChange(TodoFilter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: currentFilter === TodoFilter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => filterChange(TodoFilter.Completed)}
        >
          Completed
        </a>
      </nav>

      {todos.some(todo => todo.completed) && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handledClearAllCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
