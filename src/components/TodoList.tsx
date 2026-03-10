import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingIds: number[];
  editingId: number | null;
  editingTitle: string;
  onToggle: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onEditStart: (todo: Todo) => void;
  onEditSave: (todo: Todo) => void;
  onEditTitleChange: (title: string) => void;
  onEditCancel: () => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  loadingIds,
  editingId,
  editingTitle,
  onToggle,
  onDelete,
  onEditStart,
  onEditSave,
  onEditTitleChange,
  onEditCancel,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const isLoading = loadingIds.includes(todo.id);

        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            isLoading={isLoading}
            isEditing={editingId === todo.id}
            editingTitle={editingTitle}
            onToggle={onToggle}
            onDelete={onDelete}
            onEditStart={onEditStart}
            onEditSave={onEditSave}
            onEditTitleChange={onEditTitleChange}
            onEditCancel={onEditCancel}
          />
        );
      })}

      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
