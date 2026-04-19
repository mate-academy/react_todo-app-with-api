import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  deletingIds: number[];
  onDelete: (id: number) => void;
  updatingIds: number[];
  onToggle: (id: number) => void;
  editingId: number | null;
  onStartEdit: (id: number) => void;
  onCancelEdit: () => void;
  onSubmitEdit: (id: number, title: string) => Promise<void>;
};

export const MainSection: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  deletingIds,
  onDelete,
  updatingIds,
  onToggle,
  editingId,
  onStartEdit,
  onCancelEdit,
  onSubmitEdit,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={
            deletingIds.includes(todo.id) || updatingIds.includes(todo.id)
          }
          onDelete={onDelete}
          onToggle={onToggle}
          isEditing={editingId === todo.id}
          onStartEdit={onStartEdit}
          onCancelEdit={onCancelEdit}
          onSubmitEdit={onSubmitEdit}
        />
      ))}

      {tempTodo && (
        <TodoItem todo={tempTodo} isLoading={true} isDeleteDisabled={true} />
      )}
    </section>
  );
};
