import React, { useContext } from 'react';
import classNames from 'classnames';
import {
  TodoContext, TodoUpdateContext,
} from '../TodoContext';
import { possibleStatus } from './Footer.Constants';
import { Sort } from '../../types/enums/Sort';
import { FilterContext } from '../FilterContext';

export const Footer: React.FC = () => {
  const { todos } = useContext(TodoContext);
  const { clearCompleted } = useContext(TodoUpdateContext);
  const { filterBy, changeFilterBy } = useContext(FilterContext);
  const isCompleted = todos.some(todo => todo.completed);
  const items = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${items} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {possibleStatus.map((current) => (
          <a
            data-cy="FilterLinkAll"
            href="#/"
            className={classNames(
              'filter__link',
              { selected: current as Sort === filterBy },
            )}
            key={current}
            onClick={() => changeFilterBy(current)}
          >
            {current}
          </a>
        ))}
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        disabled={!isCompleted}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
