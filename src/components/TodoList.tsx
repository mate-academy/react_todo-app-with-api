import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  deletingIds: number[];
  updatingIds: number[];
  onDelete: (id: number) => void;
  onToggle: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deletingIds,
  updatingIds,
  onDelete,
  onToggle,
}) => {
  return (
    <>
      {todos.map(todo => {
        const isDeleting = deletingIds.includes(todo.id);
        const isUpdating = updatingIds.includes(todo.id);

        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            isDeleting={isDeleting}
            isUpdating={isUpdating}
            onDelete={onDelete}
            onToggle={onToggle}
          />
        );
      })}
    </>
  );
};
