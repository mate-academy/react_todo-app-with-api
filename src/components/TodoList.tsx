import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { FilterStatus } from '../types/FilterStatus';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  filterStatus: FilterStatus;
  isLoading: boolean;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, completed: boolean) => void;
  onTitleChange: (id: number, title: string) => void;
  deletingTodoIds: number[];
  updatingTodoIds: number[];
  tempTodo: Todo | null;
  error?: string;
};

export const TodoList: React.FC<Props> = ({
  todos,
  filterStatus,
  isLoading,
  onDelete,
  onStatusChange,
  onTitleChange,
  deletingTodoIds,
  updatingTodoIds,
  tempTodo,
  error,
}) => {
  const filteredTodos = todos.filter(todo => {
    switch (filterStatus) {
      case FilterStatus.All:
        return true;

      case FilterStatus.Active:
        return !todo.completed;

      case FilterStatus.Completed:
        return todo.completed;

      default:
        return true;
    }
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {!todos.length ? (
        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', { 'is-active': isLoading })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      ) : (
        <>
          {filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              onTitleChange={onTitleChange}
              isDeleting={deletingTodoIds.includes(todo.id)}
              isUpdating={updatingTodoIds.includes(todo.id)}
              errorHappened={!!error && updatingTodoIds.includes(todo.id)}
            />
          ))}

          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              onDelete={() => {}}
              onStatusChange={() => {}}
              onTitleChange={() => {}}
              isLoading={true}
            />
          )}
        </>
      )}
    </section>
  );
};
