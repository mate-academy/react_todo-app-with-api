import { FC, useContext } from 'react';
import classNames from 'classnames';
import { Filter } from '../../types/FilterConditions';
import { TodoContext } from '../TodoProvider';
import { FilterComponent } from '../FilterComponent';

interface Props {
  filterCondition: Filter;
  onChangeFilter: React.Dispatch<React.SetStateAction<Filter>>;
  onClearCompleted: () => void;
}

export const Footer: FC<Props> = ({
  filterCondition,
  onChangeFilter,
  onClearCompleted,
}) => {
  const { todos } = useContext(TodoContext);

  const filterNames = Object.values(Filter);
  const activeTodos = todos.filter(todo => !todo.completed);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} item${activeTodos.length > 1 ? 's' : ''} left`}
      </span>

      <FilterComponent
        filterCondition={filterCondition}
        filterNames={filterNames}
        onChangeFilter={onChangeFilter}
      />

      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          'notification hidden': !todos.some(todo => todo.completed),
        })}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>

    </footer>
  );
};
