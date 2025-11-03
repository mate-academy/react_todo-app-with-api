import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingIds: number[];
  editingId: number | null;
  onDelete: (id: number) => void;
  onUpdate: (todo: Todo) => void;
  onEditStart: (id: number) => void;
  onEditSave: (id: number, title: string) => void;
  onEditCancel: () => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  loadingIds,
  editingId,
  onDelete,
  onUpdate,
  onEditStart,
  onEditSave,
  onEditCancel,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loading={loadingIds.includes(todo.id)}
          isEditing={editingId === todo.id}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onEditStart={onEditStart}
          onEditSave={onEditSave}
          onEditCancel={onEditCancel}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          loading={true}
          isEditing={false}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onEditStart={onEditStart}
          onEditSave={onEditSave}
          onEditCancel={onEditCancel}
        />
      )}
    </section>
  );
};
