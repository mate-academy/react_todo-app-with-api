/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';
import { Filter } from '../types/Filter';

type TodoListProps = {
  todos: Todo[];
  filter: Filter;
  tempTodo: Todo | null;
  updatingIds: number[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
  editingId: number | null;
  onEdit: (id: number | null) => void;
  onUpdate: (id: number, title: string) => void;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  filter,
  tempTodo,
  updatingIds,
  onToggle,
  onDelete,
  editingId,
  onEdit,
  onUpdate,
}) => {
  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.ACTIVE:
        return !todo.completed;
      case Filter.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isUpdating={updatingIds.includes(todo.id)}
          onToggle={() => onToggle(todo.id)}
          onDelete={() => onDelete(todo.id)}
          isEditing={todo.id === editingId}
          onEdit={onEdit}
          onUpdate={(title: string) => onUpdate(todo.id, title)}
        />
      ))}

      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label" htmlFor="temp-todo-status">
            <input
              id="temp-todo-status"
              type="checkbox"
              className="todo__status"
              checked={false}
              readOnly
            />
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

export default TodoList;
