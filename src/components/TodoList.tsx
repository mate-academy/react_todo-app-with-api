import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo, TodoId } from '../types/Todo';

interface TodoListProps {
  todos: Todo[];
  onUpdateTodo: (id: TodoId, data: Partial<Todo>) => Promise<void>;
  onDeleteTodo: (id: TodoId) => Promise<void>;
  onStartEditing: (id: TodoId, title: string) => void;
  onEditSubmit: (id: TodoId, title: string) => Promise<void>;
  onEditCancel: () => void;
  editingTodoId: TodoId | null;
  editingTitle: string;
  setEditingTitle: (title: string) => void;
  todoChange: TodoId[];
  deletingTodosId: TodoId[];
  deletTodo: TodoId | null;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onUpdateTodo,
  onDeleteTodo,
  onStartEditing,
  onEditSubmit,
  onEditCancel,
  editingTodoId,
  editingTitle,
  setEditingTitle,
  todoChange,
  deletingTodosId,
  deletTodo,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onUpdate={onUpdateTodo}
        onDelete={onDeleteTodo}
        onStartEditing={onStartEditing}
        onEditSubmit={onEditSubmit}
        onEditCancel={onEditCancel}
        isEditing={editingTodoId === todo.id}
        editingTitle={editingTitle}
        setEditingTitle={setEditingTitle}
        isChanging={
          deletingTodosId.includes(todo.id) ||
          todo.id === 0 ||
          todo.id === deletTodo ||
          todoChange.includes(todo.id)
        }
      />
    ))}
  </section>
);
