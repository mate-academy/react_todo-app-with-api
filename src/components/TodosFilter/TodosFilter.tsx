import React, { useContext } from 'react';
import cn from 'classnames';
import { TodosContext } from '../../store/store';
import { Status } from '../../types/enums/Status';
import { Dispatchers } from '../../types/enums/Dispatchers';

interface Props {
  handleSetFilterParam: (param: Status) => void;
  filterParam: Status;
}

const shouldRenderButton = (complited: number, total: number): boolean => {
  if (complited < total) {
    return false;
  }

  return true;
};

export const TodoFilter: React.FC<Props> = ({
  handleSetFilterParam,
  filterParam,
}) => {
  const { todos } = useContext(TodosContext);
  const { dispatcher } = useContext(TodosContext);

  const handleDeleteComplited = () => {
    dispatcher({ type: Dispatchers.DeleteComplited });
  };

  const count = todos.filter(todo => !todo.completed).length;

  const shouldClearButtonRender = shouldRenderButton(count, todos.length);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${count} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {(Object.keys(Status) as Array<keyof typeof Status>).map((status) => (
          <a
            href="#/"
            data-cy={`FilterLink${status}`}
            className={cn(
              'filter__link',
              { selected: filterParam === status },
            )}
            onClick={() => handleSetFilterParam(Status[status])}
          >
            {Status[status]}
          </a>
        ))}
      </nav>

      <button
        style={{
          visibility: shouldClearButtonRender ? 'hidden' : 'visible',
        }}
        disabled={shouldClearButtonRender}
        type="button"
        data-cy="ClearCompletedButton"
        className="todoapp__clear-completed"
        onClick={handleDeleteComplited}
      >
        Clear completed
      </button>
    </footer>
  );
};
