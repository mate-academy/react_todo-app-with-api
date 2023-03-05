import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { SelectedBy } from '../types/SelectedBy';

interface FooterPropsType {
  todosToShow: Todo[],
  selectedStatus: SelectedBy,
  setSelectedStatus: (selectedStatus: SelectedBy) => void,
  clearCompletedTodos: () => void,
  setIsAllTodosCompleted: (isAllTodosCompleted: boolean) => void,
}

export const Footer: React.FC<FooterPropsType> = ({
  todosToShow,
  selectedStatus,
  setSelectedStatus,
  clearCompletedTodos,
  setIsAllTodosCompleted,
}) => {
  const todoLeft = todosToShow.filter(todo => !todo.completed).length;
  const isAnyCompleted = todosToShow.some(todo => todo.completed);

  const handleClearCompletedTodos = () => {
    clearCompletedTodos();
    setIsAllTodosCompleted(false);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todoLeft} items left`}
      </span>
      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: selectedStatus === SelectedBy.ALL },
          )}
          onClick={() => setSelectedStatus(SelectedBy.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: selectedStatus === SelectedBy.ACTIVE },
          )}
          onClick={() => setSelectedStatus(SelectedBy.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: selectedStatus === SelectedBy.COMPLETED },
          )}
          onClick={() => setSelectedStatus(SelectedBy.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {isAnyCompleted && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={handleClearCompletedTodos}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
