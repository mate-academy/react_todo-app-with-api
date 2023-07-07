import { FC } from 'react';
import { Filter } from '../components/Filter';
import { Todo } from '../types/Todo';
import { Filters } from '../types/Filters';

interface Props {
  uncompletedTodos: Todo[];
  completedTodos: Todo[];
  todoFilter: Filters;
  onChangeFilter: (filter: Filters) => void;
  onClearCompletedTodos: () => void;

}

export const Footer: FC<Props> = ({
  uncompletedTodos,
  todoFilter,
  onChangeFilter,
  completedTodos,
  onClearCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${uncompletedTodos.length} items left`}
      </span>

      <Filter
        todoFilter={todoFilter}
        onChangeFilter={onChangeFilter}
      />

      {completedTodos.length > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={onClearCompletedTodos}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
