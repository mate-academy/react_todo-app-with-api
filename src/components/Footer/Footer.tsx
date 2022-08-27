import React, { useState } from 'react';
import cn from 'classnames';

type Props = {
  activeTodosQty: number,
  setSortType: CallableFunction,
  clearBtnActive: boolean,
  deleteCompletedTodos: CallableFunction,
};

export const Footer: React.FC<Props> = React.memo((props) => {
  const {
    activeTodosQty,
    setSortType,
    clearBtnActive,
    deleteCompletedTodos,
  } = props;

  const [isSelected, setIsSelected] = useState('all');

  const sortTypeHandler = (type: boolean | null) => {
    setSortType(type);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodosQty} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link', { selected: isSelected === 'all' })}
          onClick={() => {
            sortTypeHandler(null);
            setIsSelected('all');
          }}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link', { selected: isSelected === 'active' })}
          onClick={() => {
            sortTypeHandler(false);
            setIsSelected('active');
          }}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn(
            'filter__link',
            { selected: isSelected === 'completed' },
          )}
          onClick={() => {
            sortTypeHandler(true);
            setIsSelected('completed');
          }}
        >
          Completed
        </a>
      </nav>
      {clearBtnActive ? (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={() => deleteCompletedTodos()}
        >
          Clear completed
        </button>
      ) : (
        <button
          style={{ opacity: 0, cursor: 'default' }}
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          disabled
        >
          Clear completed
        </button>
      )}

    </footer>
  );
});
