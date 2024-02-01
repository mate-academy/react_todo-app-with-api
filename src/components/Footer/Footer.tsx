import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { Status } from '../../types/Status';
import { TodoFilter } from '../TodoFilter';

type Props = {
  filteredTodos: Todo[],
  filterStatus: Status,
  setFilterStatus: (status: Status) => void;
  clearCompleted : (data :Todo[]) => void
};

export const Footer: FC<Props> = ({
  filteredTodos,
  setFilterStatus,
  filterStatus,
  clearCompleted,
}) => {
  const countTodosActive = (todos : Todo[]) : number => {
    const result = todos.filter(item => !item.completed);

    return result.length;
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countTodosActive(filteredTodos)} items left`}
      </span>

      <TodoFilter
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => clearCompleted(filteredTodos)}
        disabled={filteredTodos.every(item => !item.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
