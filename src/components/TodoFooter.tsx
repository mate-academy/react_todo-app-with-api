import { FilterTypes } from '../types/FilterTypes';
import { Todo } from '../types/Todo';

import { TodoFilter } from './TodoFilter';

type Props = {
  todos: Todo[],
  filterValue: FilterTypes,
  setFilterValue: (value: FilterTypes) => void,
  onClearBtn: () => void,
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  filterValue,
  setFilterValue,
  onClearBtn,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {activeTodos.length}
        {' '}
        items left
      </span>

      <TodoFilter
        filterValue={filterValue}
        setFilterValue={setFilterValue}
      />

      {todos.some(todo => todo.completed) && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={onClearBtn}
        >
          Clear completed
        </button>
      )}

    </footer>
  );
};
