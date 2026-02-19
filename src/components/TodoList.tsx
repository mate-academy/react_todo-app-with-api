import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  sortedTodoes: Todo[];
  onDelete: (id: number) => void;
  loadingIds: number[];
  todoStatus: (todo: Todo) => void;
  renameTodo: (todo: Todo, title: string) => void;
  setEditingId: (id: number | null) => void;
  editingId: number | null;
}

export const TodoList: React.FC<Props> = ({
  sortedTodoes,
  loadingIds,
  editingId,
  onDelete,
  todoStatus,
  renameTodo,
  setEditingId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {sortedTodoes.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={loadingIds.includes(todo.id)}
          isEditing={editingId === todo.id}
          onDelete={onDelete}
          todoStatus={todoStatus}
          renameTodo={renameTodo}
          setEditingId={setEditingId}
        />
      ))}
    </section>
  );
};
