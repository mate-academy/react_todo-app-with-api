import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodoId: number | null;
  editingTodoId: number | null;
  editingTitle: string;
  handleComplete: (todoId: number) => void;
  handleDelete: (todoId: number) => void;
  handleEditTodo: (todoId: number, title: string) => void;
  handleSaveEdit: (todoId: number) => void;
  handleCancelEdit: () => void;
  setEditingTitle: (title: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  loadingTodoId,
  editingTodoId,
  editingTitle,
  handleComplete,
  handleDelete,
  handleEditTodo,
  handleSaveEdit,
  handleCancelEdit,
  setEditingTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loadingTodoId={loadingTodoId}
          editingTodoId={editingTodoId}
          editingTitle={editingTitle}
          handleComplete={handleComplete}
          handleDelete={handleDelete}
          handleEditTodo={handleEditTodo}
          handleSaveEdit={handleSaveEdit}
          handleCancelEdit={handleCancelEdit}
          setEditingTitle={setEditingTitle}
        />
      ))}
      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              disabled
              aria-label={`Mark "${tempTodo.title}" as complete (pending)`}
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>
          <div data-cy="TodoLoader" className={'modal overlay is-active'}>
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
