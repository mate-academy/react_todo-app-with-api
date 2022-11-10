import React, { useMemo } from 'react';
import { TodoStatus } from '../../types/TodoStatus';
import { Todo } from '../../types/Todo';
import { FilterControls } from './FilterConstrols';

type Props = {
  todos: Todo[];
  todoStatus: TodoStatus;
  handleStatusSelect: (status: TodoStatus) => void;
  onDelete: () => Promise<void>;
};

export const TodosFilter: React.FC<Props> = ({
  todos,
  todoStatus,
  handleStatusSelect,
  onDelete,
}) => {
  const todosLeft = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const hascompletedTodos = useMemo(() => (
    todos.some(todo => todo.completed)
  ), [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosLeft} items left`}
      </span>

      <FilterControls todoStatus={todoStatus} onSelect={handleStatusSelect} />

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        style={{ visibility: hascompletedTodos ? 'visible' : 'hidden' }}
        onClick={onDelete}
      >
        Clear completed
      </button>
    </footer>
  );
};
