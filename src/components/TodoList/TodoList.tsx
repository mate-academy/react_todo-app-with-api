import React from 'react';
import { FilterStatus } from '../../types/FilterStatus';
import { TempTodo, Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  filterStatus: FilterStatus;
  tempTodo:TempTodo | null
  handleDelete: (id: number) => void;
  isLoading: boolean;
  handleStatusChange: (todo: Todo) => void
  updatingTodoId: number | null
  updatingTodoIds: number[]
};

export const TodoList:React.FC<Props> = ({
  todos,
  filterStatus,
  tempTodo,
  handleDelete,
  isLoading,
  handleStatusChange,
  updatingTodoId,
  updatingTodoIds,
}) => {
  const visibleTodos = todos.filter(todo => {
    switch (filterStatus) {
      case FilterStatus.Active:
        return !todo.completed;
      case FilterStatus.Completed:
        return todo.completed;
      default:
        return todo;
    }
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          onDelete={handleDelete}
          isLoading={isLoading}
          handleStatusChange={handleStatusChange}
          updatingTodoId={updatingTodoId}
          updatingTodoIds={updatingTodoIds}
        />
      ))}
      {tempTodo && (
        <TodoInfo
          key={tempTodo.id}
          todo={tempTodo}
        />
      )}
    </section>
  );
};
