import React from 'react';
import { Todo } from '../../types/Todo';
import { UpdateTodo } from '../UpdateTodo/UpdateTodo';

interface TodoInfoProps {
  todo: Todo,
  handleChangeCompleted: (id: number, title: string) => void,
  handleDoubleClick: (id: number) => void,
  updateTitle: (id: number, value: string) => void,
  deleteTodo: (id: number) => void,
  setEditingTodo: (value: number) => void,
  deleteTodoId: number,
  editingTodo: number,
  loadingTodo: number,
  isLoadingCompleted: boolean,
}

export const TodoInfo: React.FC<TodoInfoProps> = ({
  handleChangeCompleted,
  todo,
  deleteTodo,
  deleteTodoId,
  editingTodo,
  loadingTodo,
  handleDoubleClick,
  updateTitle,
  setEditingTodo,
  isLoadingCompleted,
}) => {
  const { id, title, completed } = todo;

  return (
    <div
      className={`todo ${completed && ('completed')}`}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleChangeCompleted(id, title)}
        />
      </label>
      {editingTodo === id
        ? (
          <UpdateTodo
            updateTitle={updateTitle}
            setEditingTodo={setEditingTodo}
            todo={todo}
          />
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => handleDoubleClick(id)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => deleteTodo(id)}
            >
              ×
            </button>
          </>
        )}

      <div className={`modal overlay
      ${(!id
        || deleteTodoId === id
        || loadingTodo === id
        || isLoadingCompleted
    ) && ('is-active')}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
