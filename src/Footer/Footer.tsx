import { FC } from 'react';
import cn from 'classnames';
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

      <button
        type="button"
        className={cn('todoapp__clear-completed', {
          hidden: completedTodos.length === 0,
        })}
        onClick={onClearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
