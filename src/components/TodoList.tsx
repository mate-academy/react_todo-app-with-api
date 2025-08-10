import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  filteredTodos: Todo[];
  loadingTodoIds: number[] | [];
  tempTodo: Todo | null;
  editingTodoId: number | null;
  editLoader: number | null;
  newTitle: string;
  editInputRef: React.LegacyRef<HTMLInputElement>;
  handleDelete: (id: number) => void;
  handleUpdateStatus: (id: number) => void;
  handleEditTitle: (id: number, title: string) => void;
  handleSaveEditTitle: (id: number) => void;
  setNewTitle: (newTitle: string) => void;
  setEditingTodoId: (editingTodoId: number | null) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  loadingTodoIds,
  tempTodo,
  editingTodoId,
  editLoader,
  newTitle,
  editInputRef,
  handleDelete,
  handleUpdateStatus,
  handleEditTitle,
  handleSaveEditTitle,
  setNewTitle,
  setEditingTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            loadingTodoIds={loadingTodoIds}
            editingTodoId={editingTodoId}
            editLoader={editLoader}
            newTitle={newTitle}
            editInputRef={editInputRef}
            handleDelete={handleDelete}
            handleUpdateStatus={handleUpdateStatus}
            handleEditTitle={handleEditTitle}
            handleSaveEditTitle={handleSaveEditTitle}
            setNewTitle={setNewTitle}
            setEditingTodoId={setEditingTodoId}
          />
        );
      })}
      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label
            className="todo__status-label"
            htmlFor={`tempTodo-${tempTodo.id}`}
          >
            {
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            }
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
