import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onDelete: (id: number) => void;
  onToggle: (todo: Todo) => void;
  onEditSubmit: (todo: Todo) => void;
  onStartEditing: (todo: Todo) => void;
  onCancelEditing: () => void;
  editingTodoId: number | null;
  editingTitle: string;
  setEditingTitle: (title: string) => void;
  deletingTodoId: number | null;
  deletingTodosIds: number[];
  updatingIds: number[];
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onDelete,
  onToggle,
  onEditSubmit,
  onStartEditing,
  onCancelEditing,
  editingTodoId,
  editingTitle,
  setEditingTitle,
  deletingTodoId,
  deletingTodosIds,
  updatingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onToggle={onToggle}
          onEditSubmit={onEditSubmit}
          onStartEditing={onStartEditing}
          onCancelEditing={onCancelEditing}
          editingTodoId={editingTodoId}
          editingTitle={editingTitle}
          setEditingTitle={setEditingTitle}
          deletingTodoId={deletingTodoId}
          deletingTodosIds={deletingTodosIds}
          updatingIds={updatingIds}
        />
      ))}
    </section>
  );
};
