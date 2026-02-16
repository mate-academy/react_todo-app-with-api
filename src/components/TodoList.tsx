/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  processingIds: number[];
  editingId: number | null;
  editTitle: string;
  setEditTitle: (v: string) => void;
  setEditingId: (id: number | null) => void;
  onToggle: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onRename: (todo: Todo) => void;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  processingIds,
  editingId,
  editTitle,
  tempTodo,
  setEditTitle,
  setEditingId,
  onToggle,
  onDelete,
  onRename,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          processing={processingIds.includes(todo.id)}
          editingId={editingId}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
          setEditingId={setEditingId}
          onToggle={onToggle}
          onDelete={onDelete}
          onRename={onRename}
        />
      ))}
      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={false}
              readOnly
            />
          </label>

          <span className="todo__title" data-cy="TodoTitle">
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
