import React, { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  handleDeleteTodo: (deleteTodo: Todo) => void;
  handleChecked: (checkedTodo: Todo) => void;
  handleUpdateTodoTitle: (
    todoId: number,
    editedTitle: string,
  ) => Promise<boolean>;
  loadingIds: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  handleChecked,
  handleUpdateTodoTitle,
  loadingIds,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const isLoading = loadingIds.includes(todo.id);

  const handleEditInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    const isSuccess = await handleUpdateTodoTitle(todo.id, editedTitle);

    if (isSuccess) {
      setIsEditing(false);
    }
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed && 'completed'}`}>
      <label className="todo__status-label">
        <input
          id={`todo-status-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleChecked(todo)}
          aria-label="Toggle todo status"
        />
      </label>
      {isEditing === true ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={editedTitle}
          onChange={handleEditInput}
          onKeyUp={async e => {
            if (e.key === 'Enter') {
              if (e.key === 'Enter') {
                const trimmedTitle = editedTitle.trim();

                if (trimmedTitle === todo.title) {
                  setIsEditing(false);

                  return;
                }
              }

              const isSuccess = await handleUpdateTodoTitle(
                todo.id,
                editedTitle,
              );

              if (isSuccess) {
                setIsEditing(false);
              }
            } else if (e.key === 'Escape') {
              setEditedTitle(todo.title);
              setIsEditing(false);
            }
          }}
          onBlur={() => {
            if (editedTitle.trim() === todo.title) {
              setIsEditing(false);
            } else {
              handleSubmit();
            }
          }}
          autoFocus
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(todo)}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${(isLoading || todo.id === 0) && 'is-active'}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
      {/* overlay will cover the todo while it is being deleted or updated */}
    </div>
  );
};
