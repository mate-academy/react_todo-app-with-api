import React from 'react';
import { FILTER_STATUS } from '../App';
import { Todo } from '../types/Todo';

type Props = {
  todoCounter: number;
  setFilterStatus: (v: FILTER_STATUS) => void;
  fillterStatus: FILTER_STATUS;
  todoData: Todo[];
  clearAllCopmpleted: (v: React.MouseEvent<HTMLButtonElement>) => void;
};

export const Footer: React.FC<Props> = ({
  todoCounter,
  setFilterStatus,
  fillterStatus,
  todoData,
  clearAllCopmpleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todoCounter} {todoCounter > 1 ? 'items' : 'item'} left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(FILTER_STATUS).map(el => {
          return (
            <a
              key={el}
              onClick={() => setFilterStatus(el)}
              href="#/"
              className={`filter__link ${fillterStatus === el && 'selected'}`}
              data-cy={`FilterLink${el}`}
            >
              {el}
            </a>
          );
        })}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        disabled={!todoData.some(el => el.completed)}
        onClick={clearAllCopmpleted}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
