import React from 'react';
import { Todo } from '../types/Todo';
import { Loader } from '../components/Loader';

type Props = {
  todo: Todo
  onRemoveTodo: (todoId: number) => void
  onCheckedTodo: (todoId: number) => void
  loading: boolean
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onRemoveTodo,
  onCheckedTodo,
  loading,
}) => {
  return (
    <>
      {loading
        ? <Loader />
        : (
          <div
            key={todo.id}
            className={`todo ${todo.completed && 'completed'}`}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                onChange={() => onCheckedTodo(todo.id)}
              />
            </label>

            <span className="todo__title">{todo.title}</span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => onRemoveTodo(todo.id)}
            >
              ×
            </button>

            <div className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}
    </>
  );
};
