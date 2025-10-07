import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: Partial<Todo>) => Promise<void>;
  deletingIds: Set<number>;
  updatingIds: Set<number>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  onUpdate,
  deletingIds,
  updatingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onUpdate={onUpdate}
          isDeleting={deletingIds.has(todo.id)}
          isUpdating={updatingIds.has(todo.id)}
        />
      ))}
    </section>
  );
};
