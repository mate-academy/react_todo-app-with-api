/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  deletingIds: number[];
  updatingIds: number[];
  toggleTodo: (todo: Todo) => void;
  deleteTodo: (todoId: number) => Promise<void> | void;
  editingTodo: Todo | null;
  newTitle: string;
  setNewTitle: (value: string) => void;
  setEditingTodo: (todo: Todo | null) => void;
  saveEditedTodo: () => void;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  deletingIds,
  updatingIds,
  toggleTodo,
  deleteTodo,
  editingTodo,
  newTitle,
  setNewTitle,
  setEditingTodo,
  saveEditedTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deletingIds={deletingIds}
          updatingIds={updatingIds}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          editingTodo={editingTodo}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          setEditingTodo={setEditingTodo}
          saveEditedTodo={saveEditedTodo}
        />
      ))}

      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={false}
              readOnly
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
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
