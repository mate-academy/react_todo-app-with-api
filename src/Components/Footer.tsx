import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface FooterPropsType {
  todosToShow: Todo[],
  selectedStatus: string,
  setSelectedStatus: (selectedStatus: string) => void,
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
            { selected: selectedStatus === 'all' },
          )}
          onClick={() => setSelectedStatus('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: selectedStatus === 'active' },
          )}
          onClick={() => setSelectedStatus('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: selectedStatus === 'completed' },
          )}
          onClick={() => setSelectedStatus('completed')}
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
