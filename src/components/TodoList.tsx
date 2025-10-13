import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  loadingIds: number[];
  onToggleTodo: (todoId: number) => Promise<void>;
  onDeleteTodo: (todoId: number) => Promise<void>;
  editingId: number | null;
  setEditingId: (id: number | null) => void;
  onEditTodo: (todoId: number) => Promise<void>;
  editTitle: string;
  setEditTitle: (title: string) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  loadingIds,
  onToggleTodo,
  onDeleteTodo,
  editingId,
  setEditingId,
  onEditTodo,
  editTitle,
  setEditTitle,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={loadingIds.includes(todo.id)}
          isEditing={editingId === todo.id}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
          onToggle={() => onToggleTodo(todo.id)}
          onDelete={() => onDeleteTodo(todo.id)}
          onEdit={() => onEditTodo(todo.id)}
          onSetEditingId={setEditingId}
        />
      ))}
    </section>
  );
};
