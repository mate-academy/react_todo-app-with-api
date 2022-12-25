import classNames from 'classnames';
import React from 'react';
import { removeTodo } from '../api/todos';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

type Props = {
  activeTodos: Todo[],
  filterBy: Filter,
  selectFilterField: (filter: Filter) => void,
  completedTodos: Todo[],
  addTodoToLoadingList: (idToRemove: number) => void,
  clearLoadingList: () => void,
  loadTodos: () => void,
};

export const Footer: React.FC<Props> = React.memo(
  ({
    activeTodos,
    filterBy,
    selectFilterField,
    completedTodos,
    addTodoToLoadingList,
    clearLoadingList,
    loadTodos,
  }) => {
    const onClearCompleted = async () => {
      await Promise.all(completedTodos.map(({ id }) => {
        addTodoToLoadingList(id);

        return removeTodo(id);
      }));

      loadTodos();
      clearLoadingList();
    };

    return (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="todosCounter">
          {`${activeTodos.length} items left`}
        </span>

        <nav className="filter" data-cy="Filter">
          <a
            data-cy="FilterLinkAll"
            href="#/"
            className={classNames('filter__link', {
              selected: filterBy === Filter.ALL,
            })}
            onClick={() => selectFilterField(Filter.ALL)}
          >
            All
          </a>

          <a
            data-cy="FilterLinkActive"
            href="#/active"
            className={classNames('filter__link', {
              selected: filterBy === Filter.ACTIVE,
            })}
            onClick={() => selectFilterField(Filter.ACTIVE)}
          >
            Active
          </a>
          <a
            data-cy="FilterLinkCompleted"
            href="#/completed"
            className={classNames('filter__link', {
              selected: filterBy === Filter.COMPLETED,
            })}
            onClick={() => selectFilterField(Filter.COMPLETED)}
          >
            Completed
          </a>
        </nav>

        <button
          data-cy="ClearCompletedButton"
          type="button"
          className={classNames('todoapp__clear-completed', {
            hidden: completedTodos.length === 0,
          })}
          onClick={onClearCompleted}
        >
          Clear completed
        </button>
      </footer>
    );
  },
);
