import React from 'react';
import { FilterStatus } from '../../types/FilterStatus';
import { TempTodo, Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  filterStatus: FilterStatus;
  tempTodo:TempTodo | null
  handleDelete: (id: number) => void;
  handleStatusChange: (todo: Todo) => void;
  updatingTodoIds: number[];
  editTodo: (todo: Todo, newTitle:string) => void;
};

export const TodoList:React.FC<Props> = ({
  todos,
  filterStatus,
  tempTodo,
  handleDelete,
  handleStatusChange,
  updatingTodoIds,
  editTodo,
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
          handleStatusChange={handleStatusChange}
          updatingTodoIds={updatingTodoIds}
          editTodo={editTodo}
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
