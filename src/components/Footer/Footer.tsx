import { memo } from 'react';
import { FilterTypes } from '../../types/Enums';
import { Todo } from '../../types/Todo';
import { Filter } from '../Filter/Filter';

type Props = {
  filterType: string,
  setFilterType: (value: FilterTypes) => void,
  deleteCompleated: () => void,
  filteredTodos: Todo[],

};

export const Footer: React.FC<Props> = memo(({
  filterType,
  filteredTodos,
  setFilterType,
  deleteCompleated,
}) => {
  const incompletedTodos = filteredTodos
    .filter(todo => !todo.completed);
  const completedTodosAmount = filteredTodos
    .filter(todo => todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${incompletedTodos.length} items left`}
      </span>

      <Filter
        filterType={filterType}
        setFilterType={setFilterType}
      />

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={deleteCompleated}
        disabled={!completedTodosAmount}
      >
        Clear completed
      </button>
    </footer>
  );
});
