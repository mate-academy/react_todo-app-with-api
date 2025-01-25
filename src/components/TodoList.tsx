/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useMemo } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { FilterOptions } from '../types/FilterOptions';

interface TodoListProps {
  todos: Todo[];
  filter: FilterOptions;
  isSubmitting: boolean;
  deletingTodoId: number | null;
  tempTodo: Todo | null;
  onDelete: (todoId: number) => void;
  handleToggleTodo: (todo: Todo) => void;
  onDoubleClickHandler: (todo: Todo) => void;
  handleBlur: (todoId: number) => void;
  editingTitle: string;
  isEditing: boolean;
  setEditingTitle: (title: string) => void;
  handleUpdateTodo: (todoId: number, event: React.FormEvent) => void; // ожидаем, что handleUpdateTodo принимает id и event
  editingTodoId: number | null;
  isDeleting: boolean;
  isTogglingTodo: boolean;
  loadingIds: number[];
  setEditingTodoId: (id: number | null) => void; // ожидаем функцию, которая обновляет editingTodoId
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  filter,
  isSubmitting,
  deletingTodoId,
  tempTodo,
  onDelete,
  onDoubleClickHandler,
  handleToggleTodo,
  handleBlur,
  editingTitle,
  isEditing,
  setEditingTitle,
  handleUpdateTodo,
  editingTodoId,
  loadingIds,
  setEditingTodoId,
}) => {
  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === FilterOptions.Active) {
        return !todo.completed;
      }

      if (filter === FilterOptions.Completed) {
        return todo.completed;
      }

      return true;
    });
  }, [todos, filter]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isSubmitting={isSubmitting}
          deletingTodoId={deletingTodoId}
          tempTodo={tempTodo}
          onDoubleClickHandler={onDoubleClickHandler}
          handleToggleTodo={() => handleToggleTodo(todo)}
          handleBlur={() => handleBlur(todo.id)}
          editingTitle={editingTitle}
          isEditing={isEditing}
          setEditingTitle={setEditingTitle}
          handleUpdateTodo={handleUpdateTodo}
          editingTodoId={editingTodoId}
          loadingIds={loadingIds}
          setEditingTodoId={setEditingTodoId}
        />
      ))}

      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
              disabled
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            disabled
          >
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="loader" />
            <div className="modal-background has-background-white-ter" />
          </div>
        </div>
      )}
    </section>
  );
};
