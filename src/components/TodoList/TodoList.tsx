import React from 'react';
import { TodoPlate } from '../TodoPlate/TodoPlate';
import { Todo } from '../../types/Todo';

type Props = {
  todoList: Todo[];
  isDeleting: number;
  isUpdating: number;
  tempTodo: Todo | null;
  onDeleteTodo: (todoId: number) => Promise<void>;
  onUpdateTodo: (todo: Todo) => Promise<void>;
  loadingBunchIds: number[];
};

export const TodoList: React.FC<Props> = React.memo(function TodoList({
  todoList,
  isDeleting,
  onDeleteTodo,
  onUpdateTodo,
  tempTodo,
  isUpdating,
  loadingBunchIds,
}) {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todoList.map(todo => (
        <TodoPlate
          todo={todo}
          key={todo.id}
          isDeleting={isDeleting}
          onDeleteTodo={onDeleteTodo}
          onUpdateTodo={onUpdateTodo}
          isUpdating={isUpdating}
          loadingBunchIds={loadingBunchIds}
        />
      ))}
      {tempTodo && (
        <TodoPlate
          todo={tempTodo}
          key={tempTodo.id}
          onDeleteTodo={onDeleteTodo}
          onUpdateTodo={onUpdateTodo}
          isUpdating={isUpdating}
          loadingBunchIds={loadingBunchIds}
        />
      )}
    </section>
  );
});
