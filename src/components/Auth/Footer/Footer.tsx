import React from 'react';
import { Todo } from '../../../types/Todo';
import { FilterType } from '../../../utils/enums/FilterType';
import { Navigation } from '../Navigation';

type Props = {
  filterType: FilterType;
  todos: Todo[];
  onFilter: (filterType: FilterType) => void;
  handleCompletedDeleting: () => void;
};

export const Footer: React.FC<Props> = ({
  filterType,
  todos,
  onFilter,
  handleCompletedDeleting,
}) => {
  const todosLeft = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosLeft} items left`}
      </span>

      <Navigation filterType={filterType} onFilter={onFilter} />

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        style={
          {
            visibility: todosLeft !== todos.length
              ? 'visible'
              : 'hidden',
          }
        }
        onClick={handleCompletedDeleting}
      >
        Clear completed
      </button>
    </footer>
  );
};
