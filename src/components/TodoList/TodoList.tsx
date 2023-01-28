import React, { memo } from 'react';
import { FilterStatus } from '../../types/FilterStatus';
import { TempTodo, Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  filterStatus: FilterStatus;
  tempTodo:TempTodo | null
  handleDelete: (id: number) => void;
  deletingTodoId: number | null;
  isLoading: boolean;
  handleStatusChange: (todo: Todo) => void
  updatingTodoId: number | null
};

export const TodoList:React.FC<Props> = memo(
  ({
    todos,
    filterStatus,
    tempTodo,
    handleDelete,
    deletingTodoId,
    isLoading,
    handleStatusChange,
    updatingTodoId,
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
            deletingTodoId={deletingTodoId}
            isLoading={isLoading}
            handleStatusChange={handleStatusChange}
            updatingTodoId={updatingTodoId}
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
  },
);
