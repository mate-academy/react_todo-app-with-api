import React from 'react';
import { Todo } from '../../types/Todo';
import { UpdateTodosTitle } from '../UpdateTodosTitle/UpdateTodosTitle';

type Props = {
  todo: Todo,
  handleChangeCompleted: (id: number) => void,
  handleDoubleClick: (id: number) => void,
  updateTitle: (id: number, value: string) => void,
  deleteTodo: (id: number) => void,
  setIsEditing: (value: number) => void,
  deleteTodoId: number,
  isEditing: number,
  isLoading: number,
  isLoadingCompleted: boolean,
};

export const TodoItem: React.FC<Props> = ({
  handleChangeCompleted,
  todo,
  deleteTodo,
  deleteTodoId,
  isEditing,
  isLoading,
  handleDoubleClick,
  updateTitle,
  setIsEditing,
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
          onChange={() => handleChangeCompleted(id)}
        />
      </label>
      {isEditing === id
        ? (
          <UpdateTodosTitle
            updateTitle={updateTitle}
            setIsEditing={setIsEditing}
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
      ${(!id || deleteTodoId === id || isLoading === id || isLoadingCompleted) && ('is-active')}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
