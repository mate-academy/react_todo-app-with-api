import { FC } from 'react';
import { TodoFilter } from '../TodoFilter';

interface Props {
  clearCompleted: () => void;
  activeTodosLeft: number;
  canClearCompleted: boolean;
}

export const TodoFooter: FC<Props> = ({
  clearCompleted,
  activeTodosLeft,
  canClearCompleted,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {`${activeTodosLeft} items left`}
    </span>

    <TodoFilter />

    <button
      type="button"
      className="todoapp__clear-completed"
      disabled={!canClearCompleted}
      onClick={clearCompleted}
    >
      Clear completed
    </button>
  </footer>
);
