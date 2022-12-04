import React from 'react';
import { Todo } from '../../types/Todo';
import { Status } from '../../types/Status';
import { TodosFilter } from './TodosFilter';
import { ClearCompletedButton } from './ClearCompletedButton';

type Props = {
  activeTodos: Todo[];
  completedTodos: Todo[];
  selectedStatus: Status;
  onSelectedStatus: (status: Status) => void;
  handleDeleteTodo: (todoId: number) => Promise<void>;
};

export const Footer: React.FC<Props> = React.memo(({
  activeTodos,
  completedTodos,
  selectedStatus,
  onSelectedStatus,
  handleDeleteTodo,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <TodosFilter
        selectedStatus={selectedStatus}
        onSelectedStatus={onSelectedStatus}
      />

      <ClearCompletedButton
        completedTodos={completedTodos}
        handleDeleteTodo={handleDeleteTodo}
      />
    </footer>
  );
});
